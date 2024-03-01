import express from "express";
import { ApolloServer } from "@apollo/server";
import bodyParser from 'body-parser'
import { expressMiddleware } from '@apollo/server/express4';

export async function initServer(){
    const app=express();

    app.use(bodyParser.json());

    const graphqlServer=new ApolloServer({
        typeDefs:`
            type Query{
                sayHello: String
                sayBye:String
            }
        `,
        resolvers:{
            Query:{
                sayHello: () => `Hello from Graphql Server`,
                sayBye:()=>'Hello from me',
            },
        },
    });

    await graphqlServer.start();

    app.use("/graphql",expressMiddleware(graphqlServer));

    return app;
}

