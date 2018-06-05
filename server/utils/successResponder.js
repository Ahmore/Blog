module.exports = (data, amount) => {
    let response = {
        data: data,
    };

    if (amount) {
        response.amount = Number(amount);
    }

    return response;
};
