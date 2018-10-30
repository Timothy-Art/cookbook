import graphene
import graphene_django

from ingredients import models


class CategoryType(graphene_django.DjangoObjectType):
    class Meta:
        model = models.Category


class IngredientType(graphene_django.DjangoObjectType):
    class Meta:
        model = models.Ingredient


class RecipeType(graphene_django.DjangoObjectType):
    class Meta:
        model = models.Recipe


class CreateIngredient(graphene.Mutation):
    ingredient = graphene.Field(IngredientType)

    class Arguments:
        name = graphene.String()
        category = graphene.String()
        notes = graphene.String(required=False)

    def mutate(self, info, name, category, notes=None):
        ingredient = models.Ingredient(name=name, category=models.Category.objects.get(name=category), notes=notes)
        ingredient.save()

        return CreateIngredient(ingredient=ingredient)


class CreateRecipe(graphene.Mutation):
    recipe = graphene.Field(RecipeType)

    class Arguments:
        name = graphene.String()
        instructions = graphene.String()
        ingredients = graphene.List(graphene.String)

    def mutate(self, info, name, instructions, ingredients):
        recipe = models.Recipe(name=name, instructions=instructions)
        recipe.save()
        for ingredient in ingredients:
            recipe.ingredients.add(models.Ingredient.objects.get(name=ingredient))

        return CreateRecipe(recipe=recipe)


class Mutation(graphene.ObjectType):
    create_ingredient = CreateIngredient.Field()
    create_recipe = CreateRecipe.Field()


class Query(graphene.ObjectType):
    category = graphene.Field(CategoryType, name=graphene.String(), id=graphene.String())
    all_categories = graphene.List(CategoryType)

    ingredient = graphene.Field(IngredientType, name=graphene.String(), id=graphene.String())
    all_ingredients = graphene.List(IngredientType)

    recipe = graphene.Field(RecipeType, name=graphene.String(), id=graphene.String())
    all_recipes = graphene.List(RecipeType)

    def resolve_category(self, info, **kwargs):
        name = kwargs.get('name')
        pk = kwargs.get('id')

        if pk is not None:
            return models.Category.objects.get(pk=pk)
        if name is not None:
            return models.Category.objects.get(name=name)
        return None

    def resolve_all_categories(self, info):
        return models.Category.objects.all()

    def resolve_ingredient(self, info, **kwargs):
        name = kwargs.get('name')
        pk = kwargs.get('id')

        if pk is not None:
            return models.Ingredient.objects.get(pk=pk)
        if name is not None:
            return models.Ingredient.objects.get(name=name)
        return None

    def resolve_all_ingredients(self, info):
        return models.Ingredient.objects.all()

    def resolve_recipe(self, info, **kwargs):
        name = kwargs.get('name')
        pk = kwargs.get('id')

        if pk is not None:
            return models.Recipe.objects.get(pk=pk)
        if name is not None:
            return models.Recipe.objects.get(name=name)
        return None

    def resolve_all_recipes(self, info):
        return models.Recipe.objects.all()
