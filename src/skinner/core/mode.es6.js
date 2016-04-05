export const isTestMode = () => {
    const search = window.location.search;
    const matches = search.match(/test=([^&]*)&*/);
    if (matches && matches.length == 2) {
        if (matches[1] === "true") {
            return true;
        }
    }
    return false;
};
