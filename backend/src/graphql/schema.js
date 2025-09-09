import { gql } from 'graphql-tag';

import { helloTypeDefs } from './helloTypeDefs.js'; 
import { userTypeDefs } from './userTypeDefs.js';

import { helloResolver } from '../resolvers/helloResolver.js';
import { userResolver } from '../resolvers/userResolver.js';

// Base type definitions
const baseTypeDefs = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [baseTypeDefs, helloTypeDefs, userTypeDefs];
export const resolvers = [helloResolver, userResolver];
