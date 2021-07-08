module.exports = {
    ifUrl(url) {
        let ifUrl = /(https?:\/\/[^ ]*)/;
        if(ifUrl.test(url)) return true;
        else return false;
    },
    isHexValid (hex) {
        const cRegex = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
        if(hex.match(cRegex)) return true
        else return false
    },

    
}