var Contact = {};

Contact.deobfuscateLink = function(element) {
    var absolutePath   = element.href,
        pathSegments   = absolutePath.split('/'),
        obfuscatedLink = pathSegments[pathSegments.length - 1],
        unreversedLink = obfuscatedLink.split('').reverse().join(''),
        deobfuscation  = decodeURIComponent(unreversedLink);
    return deobfuscation;
}

Contact.patchButton = function(klass) {
    var element = document.getElementsByClassName(klass)[0];
    element.href = Contact.deobfuscateLink(element);
}

Contact.patchButton('nav__item--contact');
