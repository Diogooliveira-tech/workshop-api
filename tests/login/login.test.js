const request = require('supertest')
// const assert = require('node:assert')
const expect = require('chai').expect
const Ajv = require('ajv')
const ajv = new Ajv()

const getProdutosSchema = {
    type: 'object',
    properties: {
        data: {
            type: 'array',
            items: {
                type: 'object',
                required: [
                    'produtoId',
                    'produtoNome',
                    'produtoValor',
                    'produtoCores',
                    'produtoUrlMock',
                    'componentes'
                ],
                properties: {
                    produtoIds: {
                        type: 'string'
                    },
                    produtoNome: {
                        type: 'string'
                    },
                    produtoValor: {
                        type: 'integer'
                    },
                    produtoCores: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    },
                    produtoUrlMock: {
                        type: 'string'
                    },
                    componentes: {
                        type: 'array',
                        items: {}
                    }
                }
            }
        },
        message: {
            type: 'string'
        },
        error: {
            type: 'string'
        }
    }
}

describe('Produtos', () => {
    it('Deve buscar os produtos ao enviar credenciais válidas', async () => {
        const loginResponse = await request('http://165.227.93.41/lojinha/v2')
            .post('/login')
            .set('Content-Type', 'application/json')
            // .auth('usuario', 'senha')
            .send({
                'usuarioLogin': 'cgts',
                'usuarioSenha': '123456'
            }) 
        
        const token = loginResponse.body.data.token

        const produtosResponse = await request('http://165.227.93.41/lojinha/v2')
            .get('/produtos')
            .set('token', token)

        // assert.equal(produtosResponse.body.message, 'Listagem de produtos realizada com sucesso')  
        // assert.equal(produtosResponse.status, 200)

        expect(produtosResponse.body.message).to.be.equal('Listagem de produtos realizada com sucesso')
        expect(produtosResponse.status).to.be.equal(200)
        expect(produtosResponse.body.message).to.include('sucesso')

        const trackinas = {
            produtoId: 983363,
            produtoNome: 'Trackinas',
            produtoValor: 7000,
            produtoCores: [ 'Rosa' ],
            produtoUrlMock: 'N/A',
            componentes: []
        }

        expect(produtosResponse.body.data).to.deep.include(trackinas)
        expect(produtosResponse.body.data[0]).to.have.property('produtoUrlMock')
        // expect(produtosResponse.body.data[0].produtoNome).to.be.a('string')

        const validate = ajv.compile(getProdutosSchema)
        const atendeuAoSchema = validate(produtosResponse.body)

        console.log(atendeuAoSchema)

        expect(atendeuAoSchema).to.be.true;
    })
})