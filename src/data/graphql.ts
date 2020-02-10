import { typeDefs } from "./typedefs";
import resolvers from './resolvers';

import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
    typeDefs,
    resolvers
});

export default client;
