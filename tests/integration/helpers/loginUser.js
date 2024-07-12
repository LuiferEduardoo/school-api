async function loginUser(credential, password) {
    const res = await request
        .post('/api/v1/auth/login')
        .send({ credential, password });
    return res.body.tokenAccess.token;
}

module.exports = loginUser