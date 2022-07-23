import prismCss from '!!prismjs/themes/prism-okaidia.css?raw';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
font,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
form,
label,
caption,
table,
tbody,
tfoot,
thead,
tr,
th,
td {
    margin: 0;
    padding: 0;
    border: 0;
}
a {
    color: inherit;
    text-decoration: none;
}
img {
    border: 0;
    vertical-align: middle;
}

blockquote,
q {
    quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
    content: '';
}

a:focus {
    outline: 0;
    text-decoration: none;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
main,
nav,
section,
summary {
    display: block;
}

button:focus {
    outline: none;
}


    ${prismCss};


    body {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: #333;
    }

    label{
        font-size: 14px;
    }
    code[class*="language-"]{
        padding: 20px;
        display: block;
        font-size: 13px;
        color: #f8f8f2;
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    }
    pre[class*="language-"] {
        background: #001e3c;
    }
`;
