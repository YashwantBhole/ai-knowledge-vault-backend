const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AI knowledge Vault API",
            version: "1.0.0",
            description: " Backend API for AI Knowledge Vault (RAG Engine)"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Lcoal Server "
            },
            {
                url: "https://ai-knowledge-vault-backend.onrender.com",
                description: "Production Server"
            }
        ]
    },
    apis: ["./server.js"],  //adjust your path   
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };