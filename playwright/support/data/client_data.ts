import { faker } from '@faker-js/faker/locale/pt_BR';
import { cpf } from 'cpf-cnpj-validator';

export const DEFAULT_STORE = 'Velô Morumbi - Av. Morumbi, 1500';

export type Client = {
    name: string,
    surname: string,
    email: string,
    phone: string,
    cpf: string,
    store: string
}

export function getRandomClient(): Client {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    return {
        name,
        surname,
        // Sufixo único garante que o email não se repete entre testes paralelos
        email: faker.internet.email({ firstName: name, lastName: surname, provider: 'example.com' }).toLowerCase()
            .replace('@', `_${faker.string.alphanumeric(6).toLowerCase()}@`),
        // Celular de SP: DDD 11 + 9 + 8 dígitos (a UI aplica a máscara)
        phone: '119' + faker.string.numeric(8),
        cpf: cpf.generate(),
        store: DEFAULT_STORE,
    };
}
