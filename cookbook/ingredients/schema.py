import django_filters
import graphene
import django.db

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from ingredients import models


class CategoryFilter(django_filters.FilterSet):
    class Meta:
        model = models.Category
        fields = ['name', 'id', ]


class CategoryType(DjangoObjectType):
    class Meta:
        model = models.Category
        interfaces = (graphene.relay.Node, )


class IngredientFilter(django_filters.FilterSet):
    class Meta:
        model = models.Ingredient
        fields = {
            'name': ['exact', 'in'],
            'category__name': ['exact', 'in'],
            'id': ['exact'],
        }


class IngredientType(DjangoObjectType):
    class Meta:
        model = models.Ingredient
        interfaces = (graphene.relay.Node, )


class RecipeFilter(django_filters.FilterSet):
    class Meta:
        model = models.Recipe
        fields = {
            'name': ['exact', 'icontains'],
            'ingredients': ['exact'],
            'ingredients__name': ['exact', 'in'],
            'id': ['exact'],
        }


class RecipeType(DjangoObjectType):
    class Meta:
        model = models.Recipe
        interfaces = (graphene.relay.Node, )


class CreateIngredient(graphene.relay.ClientIDMutation):
    ingredient = graphene.Field(IngredientType)

    class Input:
        name = graphene.String(required=True)
        category = graphene.String(required=True)
        notes = graphene.String(required=False)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        assert input['name'] != '', ValueError('Name cannot be blank!')
        notes = input.get('notes')

        try:
            ingredient = models.Ingredient(
                name=input['name'],
                category=models.Category.objects.get(name=input['category']),
                notes=notes
            )
            ingredient.save()
        except django.db.IntegrityError:
            raise ValueError('Ingredient already exists!')

        return CreateIngredient(ingredient=ingredient)


class DeleteIngredient(graphene.relay.ClientIDMutation):
    ingredient = graphene.Field(IngredientType)

    class Input:
        id = graphene.ID(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        ingredient = models.Ingredient.objects.get(pk=input['id'])
        ingredient.delete()

        return DeleteIngredient(ingredient=ingredient)


class CreateRecipe(graphene.relay.ClientIDMutation):
    recipe = graphene.Field(RecipeType)

    class Input:
        name = graphene.String(required=True)
        instructions = graphene.String(required=True)
        ingredients = graphene.List(graphene.String, required=False)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        assert input['name'] != '', ValueError('Name cannot be blank!')
        assert input['instructions'] != '', ValueError('Recipe directions are not filled in!')

        recipe = models.Recipe(name=input['name'], instructions=input['instructions'])
        recipe.save()

        for ingredient in input['ingredients']:
            try:
                i = models.Ingredient.objects.get(name=ingredient)
                recipe.ingredients.add(i)
            except models.Ingredient.DoesNotExist:
                recipe.delete()
                raise Exception('Selected Ingredient does not exist!')

        return CreateRecipe(recipe=recipe)


class DeleteRecipe(graphene.relay.ClientIDMutation):
    recipe = graphene.Field(RecipeType)

    class Input:
        id = graphene.ID(required=True)

    @classmethod
    def mutate(cls, root, info, **input):
        recipe = models.Recipe.objects.get(pk=input['id'])
        recipe.delete()

        return DeleteRecipe(recipe=recipe)


class Mutation(graphene.ObjectType):
    create_ingredient = CreateIngredient.Field()
    delete_ingredient = DeleteIngredient.Field()
    create_recipe = CreateRecipe.Field()
    delete_recipe = DeleteRecipe.Field()


class Query(graphene.ObjectType):
    category = graphene.relay.Node.Field(CategoryType)
    categories = DjangoFilterConnectionField(CategoryType, filterset_class=CategoryFilter)

    ingredient = graphene.relay.Node.Field(IngredientType)
    ingredients = DjangoFilterConnectionField(IngredientType, filterset_class=IngredientFilter)

    recipe = graphene.relay.Node.Field(RecipeType)
    recipes = DjangoFilterConnectionField(RecipeType, filterset_class=RecipeFilter)

