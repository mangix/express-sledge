exports.execute = function (req, res) {
    res.result("success", {
        id: req.params.userId
    });
};