let cache = {
    activos: [],
    estados: {},
    baselines: {}
};

module.exports = {
    cache,
    updateCache(type, data) {
        cache[type] = data;
    }
};
