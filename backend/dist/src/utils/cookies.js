export function parseCookies(headerValue) {
    if (!headerValue) {
        return {};
    }
    return headerValue
        .split(';')
        .map((part) => part.trim())
        .filter(Boolean)
        .reduce((cookies, part) => {
        const [name, ...valueParts] = part.split('=');
        if (!name || valueParts.length === 0) {
            return cookies;
        }
        const rawValue = valueParts.join('=');
        try {
            cookies[name] = decodeURIComponent(rawValue);
        }
        catch {
            cookies[name] = rawValue;
        }
        return cookies;
    }, {});
}
