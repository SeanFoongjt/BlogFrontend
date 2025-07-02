/**
 * Encode string according to the encoding type provided such that syntax for each type of
 * encoding is properly parsed.
 * @param {String} string the string to be encoded
 * @param {String} encoding which encoding to use on the string. Only takes in the values
 * Plaintext, HTML and Markdown
 * @returns 
 */
function encodeText(string, encoding="Plaintext") {
    // Process text based on encoding type selected
    if (encoding == "Plaintext") {
        //console.log(editorHTML);
        return string;
    } else if (encoding == "HTML") {
        //console.log(editorHTML);
        //console.log(unescapeHTML(removeP(editorHTML)));
        return unescapeHTML(removeP(string));
    }  else if (encoding == "Markdown") {
        //console.log(editorHTML);
        //console.log(removeP(editorHTML, "Markdown"));
        //console.log(marked.parse(removeP(editorHTML, "Markdown")));
        return marked.parse(removeP(string, "Markdown"));
    }
}

/**
 * Unescape escaped html characters 
 * @param {String} string string to be unescaped
 * @returns 
 */
function unescapeHTML(string) {
    let finalString = string;
    finalString = finalString.replaceAll("&lt;", "<");
    finalString = finalString.replaceAll("&gt;", ">");
    finalString = finalString.replaceAll("&quot", '"');
    finalString = finalString.replaceAll("&#39", "'");
    finalString = finalString.replaceAll("&apos", "'");
    finalString = finalString.replaceAll("&amp", "&");

    return finalString;
}

/**
 * Remove <p> and </p> inserted by the quill editor using a sliding window
 * @param {String} string string from which the auto inserted <p> and </p>s are removed
 * @param {String} encoding either HTML or Markdown
 * @returns 
 */
// Use a sliding window to remove the <p> and </p> inserted by the quill editor
function removeP(string, encoding="HTML") {
    let count = 0;
    let finalString = string;

    // iterate from end of string to prevent indexing errors when slicing
    for (let i = string.length; i >= 3; i--) {
        // Sliding windows of length 3 and 4 to detect <p> and </p> respectively
        const pWindow = string.substring(i - 3, i);
        const slashPWindow = string.substring(i - 4, i);

        if (slashPWindow === "</p>") {
            count += 1;

            // If count === 1, this is the outermost (and hence editor inserted) </p> of 
            // a block inserted by quill
            if (count === 1 && encoding == "HTML") {
                finalString = finalString.slice(0, i - 4) + "<br>" + finalString.slice(i);

            } else if (encoding == "Markdown") {
                finalString = finalString.slice(0, i - 4) + "\n" + finalString.slice(i);
            }   

        } else if (pWindow === "<p>") {
            count -= 1;

            // Similarly if count === 0, this is the outermost (hence editor inserted) <p> 
            // of a block
            if (count === 0) {
                finalString = finalString.slice(0, i-3) + finalString.slice(i);
            }
        }
    }
    if (encoding == "Markdown") {
        finalString = finalString.replaceAll("<br>", "\n");
        //finalString = finalString.replaceAll("</iframe>", "</iframe>\n\n");
    }

    return finalString
}

export { encodeText };