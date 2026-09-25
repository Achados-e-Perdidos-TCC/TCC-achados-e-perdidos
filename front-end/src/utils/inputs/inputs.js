function verificaEmailSenha(email, senha){
    if (typeof email !== 'string' || !email){ throw new Error('Email inválido') }
    if (typeof senha !== 'string' || !senha || senha.length < 8){  throw new Error('Senha inválida') }
}

export { verificaEmailSenha }