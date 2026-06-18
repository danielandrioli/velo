export function gerarCodigoPedido(): string {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let sufixo = "";

    for (let i = 0; i < 6; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        sufixo += caracteres[indice];
    }

    return `VLO-${sufixo}`;
}