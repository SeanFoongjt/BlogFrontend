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

// Use a sliding window to remove the <p> and </p> inserted by the quill editor
function removeP(string, encoding="HTML") {
    let count = 0;
    let finalString = string;

    for (let i = string.length; i >= 3; i--) {
        // Sliding windows of length 3 and 4 to detect <p> and </p> respectively
        const pWindow = string.substring(i - 3, i);
        const slashPWindow = string.substring(i - 4, i);

        if (slashPWindow === "</p>") {
            count += 1;

            // If count === 1, this is the outermost </p> of a block inserted by quill
            if (count === 1 && encoding == "HTML") {
                finalString = finalString.slice(0, i - 4) + "<br>" + finalString.slice(i);

            } else if (encoding == "Markdown") {
                finalString = finalString.slice(0, i - 4) + "\n" + finalString.slice(i);
            }   
        } else if (pWindow === "<p>") {
            count -= 1;

            // Similarly if count === 0, this is the outermost <p> of a block
            if (count === 0  && encoding == "HTML") {
                finalString = finalString.slice(0, i-3) + finalString.slice(i);

            } else if (encoding == "Markdown") {
                finalString = finalString.slice(0, i - 3) + finalString.slice(i);
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