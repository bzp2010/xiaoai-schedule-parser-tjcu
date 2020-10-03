function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    const frs = dom.getElementsByTagName("frame");

    for (let i = 0; i < frs.length; i++) {
        const dom = frs[i].contentDocument.body;

        if (frs[i].id === 'mainF') {
            return dom.innerHTML;
        } else {
            if (result = scheduleHtmlProvider(iframeContent, frameContent, dom)) {
                return result;
            }
        }
    }
}