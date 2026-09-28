function verificaEmailSenha(email, senha){
    if (typeof email !== 'string' || !email || !email.includes('@')){ throw new Error('Email inválido') }

    if (typeof senha !== 'string' || !senha || senha.length < 8){  throw new Error('Senha inválida') }
}

function verificaTelefone(telefoneCadastrado) {

    const telefone = telefoneCadastrado.replace(/\D/g, '');

    const tem11Digitos = telefone.length === 11;
    const temApenasNumeros = !isNaN(telefone);

    if (!tem11Digitos || !temApenasNumeros){ throw new Error('Telefone inválido') };
}

function verificaSenhaCadastro(senha) {

    if (typeof senha !== 'string' || !senha || senha.length < 8) { throw new Error('Senha inválida') }

    if (!/[A-Z]/.test(senha)) { throw new Error('Senha inválida') }

    if (!/[a-z]/.test(senha)) { throw new Error('Senha inválida') }

    if (!/[0-9]/.test(senha)) { throw new Error('Senha inválida') }

    if (!/[^A-Za-z0-9]/.test(senha)) { throw new Error('Senha inválida') }
}

export { verificaEmailSenha, verificaTelefone, verificaSenhaCadastro }