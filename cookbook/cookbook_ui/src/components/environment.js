import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { GRAPHQLBASE } from "../constants/urls";

const fetchQuery = (operation, variables, cacheConfig, uploadables) => {
    console.log(GRAPHQLBASE);

    return fetch(GRAPHQLBASE, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            query: operation.text,
            variables
        })
    }).then(response => {
        console.log(response);
        return response.json();
    });
};

const environment = new Environment({
   network: Network.create(fetchQuery),
   store: new Store(new RecordSource()),
});

export default environment;
