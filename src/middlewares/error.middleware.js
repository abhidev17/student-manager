const errorHandler = (err, req, res, next) => {
    console.error(err); // log for dev

    // Mongoose invalid ID
    if (err.name === "CastError") {
        return res.status(400).json({
            error: "Invalid ID format"
        });
    }

    // Validation errors
    if (err.name === "ValidationError") {
        return res.status(400).json({
            error: err.message
        });
    }

    // Default error
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    });
};

module.exports = errorHandler;
