module.exports = {
    ifUrl(url) {
        let ifUrl = /(https?:\/\/[^ ]*)/;
        if(ifUrl.test(url)) return true;
        else return false;
    }
}