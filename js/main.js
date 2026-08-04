//Grabbing user input and output elements
var textBox = document.getElementById("OriginalText");
var convertedBox = document.getElementById("ConvertedText");

function copy() {
  alert("hello");
}

//Set checkbox options to display

function showLinkCheckbox(checkbox) {
  var k = document.getElementById("hyperlinkFields");
  k.classList.toggle("hyperlink-display", checkbox.checked);
  k.classList.toggle("hyperlink-hide", !checkbox.checked);
}

function showunLinkheckbox(displayId) {
  var k = document.getElementById("unlink-hide");
  k.id = "unlink-display";
}

//Setting up object that corresponds to radio buttons
var object1 = {
  transform1: lowerCase,
  transform2: upperCase,
  transform3: convertToSentenceCase,
  transform4: straightenMSO,
  transform5: SpanishChars,
  transform6: supLegal,
  transform7: SpecialChars,
  transform8: RemoveSpace,
  transform9: addlineReturn,
  transform10: spanLegal,
  transform11: Links,
  transform12: hyperLink,
  transform15: NoTransform,
  transform16: removeJunkChars,
  transform17: NoSupLegal,
  transform18: plainLegal,
};

//Triggered when user presses the convert button
function ConversionTrigger() {
  var checked = check();
  checked = orderTransforms(checked);

  var reportBox = document.getElementById("junkReport");
  if (reportBox) {
    reportBox.textContent = "";
  }

  clearAllColorHex2Warnings();

  checked.forEach((optId) => {
    //object1['transform1']()
    console.log("optId = ", optId);
    object1[optId]();
  });
}

//"Add <br>" must run before "Strip Line Returns" when both are checked -
//both act on \n, so stripping first leaves nothing for addlineReturn to convert.
function orderTransforms(checked) {
  var brIdx = checked.indexOf("transform9");
  var stripIdx = checked.indexOf("transform8");
  if (brIdx !== -1 && stripIdx !== -1 && brIdx > stripIdx) {
    checked.splice(brIdx, 1);
    checked.splice(stripIdx, 0, "transform9");
  }
  return checked;
}

//Grab all checkboxs and radio buttons
function check() {
  var boxCheck = document.querySelectorAll("input[type='checkbox']");
  var radioCheck = document.querySelectorAll(
    "input[type='radio'][name='transform'], input[type='radio'][name='supLegalFormat']"
  );
  var i = 0;
  var StoreCheckStatus = [];

  //If radio button checked add to array
  radioCheck.forEach((element) => {
    if (element.checked) {
      StoreCheckStatus.push(element.id);
    }
  });
  //If box is checked add to array
  //While iterates through all boxes
  //function checks if they are checked
  while (i < boxCheck.length) {
    var x = boxCheck[i];
    if (x.checked) {
      StoreCheckStatus.push(x.id);
    }
    i++;
  }
  return StoreCheckStatus;
}

//No change to text casing
function NoTransform() {
  var x = textBox.value;
  convertedBox.value = x;
}

//Lower case the word casing of the inputed value
function lowerCase() {
  //alert(textBox.value);
  var x = textBox.value;

  convertedBox.value = x.toLowerCase();
}
//Upper case the word casing of the inputed value
function upperCase() {
  var x = textBox.value;

  convertedBox.value = x.toUpperCase();
}

//Proper case the word casing of the inputed value.
function firstLetterUpper(valueToFormat) {
  var formattedString = valueToFormat.toLowerCase().replace(
    /(^\s*\w|[\.\!\?]\s*\w)/g,
    //c is the matched character from the regex when it matches something
    function (c) {
      return c.toUpperCase();
    }
  );
  return formattedString;
}

function convertToSentenceCase() {
  var inputTextValue = textBox.value;
  var convertedValue = firstLetterUpper(inputTextValue);
  //console.log("Converted: "+newString);
  convertedBox.value = convertedValue;
}

function straightenMSO() {
  var straightMSO = convertedBox.value;
  convertedBox.value = straightMSO
    .replace(RegExp("\u201D", "g"), '"')
    .replace(RegExp("\u201C", "g"), '"')
    .replace(RegExp("\u02BC", "g"), "'")
    .replace(RegExp("\u2019", "g"), "'")
    .replace(RegExp("\u2018", "g"), "'");
}

//Special character library
var objectSpecialChars = {
  "\u00BB": "&raquo;",
  "\u00AB": "&laquo;",
  "\u203A": "&rsaquo;",
  "\u2039": "&lsaquo;",
  "\u00B0": "&deg;",
  "\u2022": "&bull;",
  "\u007E": "&#126;",
  "\u2026": "&hellip;",
  "\u2020": "&dagger;",
  "\u2021": "&Dagger;",
  "\u2E4B": "&#11851;",
  "\u201D": "&rdquo;",
  "\u201C": "&ldquo;",
  "\u2013": "&ndash;",
  "\u2014": "&mdash;",
  "\u2022": "&bull;",
  "\u00A6": "&brvbar;",
  "\u00B9": "&sup1;",
  "\u00B2": "&sup2;",
  "\u00B3": "&sup3;",
  "\u00B6": "&para;",
  "\u00B7": "&middot;",
  "\u25B8": "&#x25b8;",
  "\u20AC": "&euro;",
  "\u20AC": "&euro;",
  "\u00A3": "&pound;",
  "\u00A5": "&yen;",
  "\u00A2": "&cent;",
  "\u2018": "&lsquo;",
};

//Loop through objectSpecialChars
function SpecialChars() {
  var SpecialChar = convertedBox.value;

  Object.entries(objectSpecialChars).forEach(([unicode, htmlChar]) => {
    console.log(unicode, htmlChar);

    SpecialChar = SpecialChar.replace(RegExp(unicode, "g"), htmlChar);
  });
  convertedBox.value = SpecialChar;
}

//Codepoint ranges for invisible/junk characters commonly injected by apps
//like Photoshop (private-use-area glyph substitutions), rich text editors
//(zero-width joiners, BOMs), and stray control characters from copy/paste.
var junkCharRanges = [
  [0x0000, 0x0008],
  [0x000b, 0x000c],
  [0x000e, 0x001f],
  [0x007f, 0x007f],
  [0x00ad, 0x00ad],
  [0x200b, 0x200f],
  [0x2028, 0x202e],
  [0x2060, 0x2064],
  [0xe000, 0xf8ff],
  [0xfeff, 0xfeff],
  [0xfff9, 0xfffb],
  [0xfffd, 0xfffd],
  [0xf0000, 0xffffd],
  [0x100000, 0x10fffd],
];

function isJunkChar(codePoint) {
  return junkCharRanges.some(
    ([start, end]) => codePoint >= start && codePoint <= end
  );
}

//Strips junk characters from the converted text and reports what was removed
function removeJunkChars() {
  var input = convertedBox.value;
  var removedCounts = {};
  var output = "";

  for (var chr of input) {
    var codePoint = chr.codePointAt(0);
    if (isJunkChar(codePoint)) {
      var key = "U+" + codePoint.toString(16).toUpperCase().padStart(4, "0");
      removedCounts[key] = (removedCounts[key] || 0) + 1;
    } else {
      output += chr;
    }
  }

  convertedBox.value = output;
  reportJunkRemoved(removedCounts);
}

//Displays a summary of removed junk characters near the textareas
function reportJunkRemoved(removedCounts) {
  var reportBox = document.getElementById("junkReport");
  if (!reportBox) {
    return;
  }

  var keys = Object.keys(removedCounts);
  if (keys.length === 0) {
    reportBox.textContent = "No junk characters found.";
    return;
  }

  var total = keys.reduce((sum, key) => sum + removedCounts[key], 0);
  var details = keys
    .map((key) => key + " (×" + removedCounts[key] + ")")
    .join(", ");
  reportBox.textContent =
    "Removed " + total + " junk character(s): " + details;
}

//Spanish Special character library
var objectSpanishChars = {
  "\u00A1": "&iexcl;",
  "\u00BF": "&iquest;",
  "\u00C1": "&Aacute;",
  "\u00E1": "&aacute;",
  "\u00C9": "&Eacute;",
  "\u00E9": "&eacute;",
  "\u00ED": "&iacute;",
  "\u00D1": "&Ntilde;",
  "\u00F1": "&ntilde;",
  "\u00D3": "&Oacute;",
  "\u00F3": "&oacute;",
  "\u00DA": "&Uacute;",
  "\u00FA": "&uacute;",
  "\u00DC": "&Uuml;",
  "\u00FC": "&uuml;",
};

//Special characters Spanish
function SpanishChars() {
  var SpanishChar = convertedBox.value;

  Object.entries(objectSpanishChars).forEach(([unicodeSp, htmlCharSp]) => {
    SpanishChar = SpanishChar.replace(RegExp(unicodeSp, "g"), htmlCharSp);
  });
  convertedBox.value = SpanishChar;
}

//N/A option for the Superscript Legal Chars radio group - no formatting applied
function NoSupLegal() {}

function supLegal() {
  var supLegal = convertedBox.value;
  supLegal = supLegal
    .replace(RegExp("\u00A9", "g"), "<sup>&copy;</sup>")
    .replace(RegExp("\u00AE", "g"), "<sup>&reg;</sup>")
    .replace(RegExp("\u2122", "g"), "<sup>&trade;</sup>");
  convertedBox.value = supLegal;
}
function RemoveSpace() {
  var RemoveSpace = convertedBox.value;
  RemoveSpace = RemoveSpace.replace(RegExp("\n", "g"), "");

  convertedBox.value = RemoveSpace;
}

function addlineReturn() {
  var RemoveSpace = convertedBox.value;
  RemoveSpace = RemoveSpace.replace(RegExp("\n", "g"), "<br>");

  convertedBox.value = RemoveSpace;
}
function spanLegal() {
  var spanLegal = convertedBox.value;
  spanLegal = spanLegal
    .replace(
      RegExp("\u00A9", "g"),
      '<span style="font-size:70%;line-height:0;vertical-align:3px;">&copy;</span>'
    )
    .replace(
      RegExp("\u00AE", "g"),
      '<span style="font-size:70%;line-height:0;vertical-align:3px;">&reg;</span>'
    )
    .replace(
      RegExp("\u2122", "g"),
      '<span style="font-size:70%;line-height:0;vertical-align:3px;">&trade;</span>'
    );
  convertedBox.value = spanLegal;
}

//Converts legal chars to HTML entities without superscripting them
function plainLegal() {
  var plainLegal = convertedBox.value;
  plainLegal = plainLegal
    .replace(RegExp("\u00A9", "g"), "&copy;")
    .replace(RegExp("\u00AE", "g"), "&reg;")
    .replace(RegExp("\u2122", "g"), "&trade;");
  convertedBox.value = plainLegal;
}

function Links() {
  var Links = convertedBox.value;
  var RegexNumbers = /((\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$)/g;

  //grab input values
  var className = document.getElementById("className");
  var ColorHex = document.getElementById("ColorHex");

  var classNameValue = className.value;
  var ColorHexValue = ColorHex.value;

  Links = Links.replace(
    RegexNumbers,
    '<span class="' +
      classNameValue +
      '"><a style="color:#' +
      ColorHexValue +
      ';text-decoration:none;">$1</a></span>'
  );
  convertedBox.value = Links;
}

//Matches 3/6/8-digit hex color values, with or without a leading #
function isValidHexColor(value) {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(
    value.trim()
  );
}

function clearAllColorHex2Warnings() {
  for (var i = 1; i <= MAX_HYPERLINKS; i++) {
    var warningBox = document.getElementById("colorHex2Warning_" + i);
    if (warningBox) {
      warningBox.textContent = "";
    }
  }
}

//Validates a single hyperlink color slot and shows/clears its own warning,
//so feedback appears right under that color box once the user is done typing.
function validateColorHex2Slot(i) {
  var ColorHex2 = document.getElementById("ColorHex2_" + i);
  var warningBox = document.getElementById("colorHex2Warning_" + i);
  if (!ColorHex2 || !warningBox) {
    return;
  }

  var ColorHex2Output = ColorHex2.value.replace(/^#/, "");
  warningBox.textContent =
    ColorHex2Output.length > 0 && !isValidHexColor(ColorHex2Output)
      ? "Hex color is most compatible for email."
      : "";
}

//Fixed set of 5 hyperlink slots already exist in the DOM (rows 2-5 start
//hidden); the "+" button just reveals the next one rather than creating new
//elements, so the number of links processed per convert stays bounded.
var MAX_HYPERLINKS = 5;
var nextHyperlinkSlot = 2;

function addHyperlinkRow() {
  if (nextHyperlinkSlot > MAX_HYPERLINKS) {
    return;
  }

  var row = document.getElementById("hyperlinkRow" + nextHyperlinkSlot);
  if (row) {
    row.classList.remove("hyperlink-row-hidden");
  }
  nextHyperlinkSlot++;

  if (nextHyperlinkSlot > MAX_HYPERLINKS) {
    var addBtn = document.getElementById("addHyperlinkBtn");
    if (addBtn) {
      addBtn.style.display = "none";
    }
  }
}

//Hides slot i (2-5), clears its fields, and reopens it as the next slot the
//"+" button will reveal, since removing a middle link shouldn't strand the
//add button in its "all slots used" hidden state.
function removeHyperlinkRow(i) {
  var row = document.getElementById("hyperlinkRow" + i);
  if (!row) {
    return;
  }
  row.classList.add("hyperlink-row-hidden");

  var hyperLinkText = document.getElementById("hyperLinkText" + i);
  var ColorHex2 = document.getElementById("ColorHex2_" + i);
  if (hyperLinkText) {
    hyperLinkText.value = "";
  }
  if (ColorHex2) {
    ColorHex2.value = "";
  }
  var warningBox = document.getElementById("colorHex2Warning_" + i);
  if (warningBox) {
    warningBox.textContent = "";
  }
  var noUnderlineRadio = document.getElementById("nounderline" + i);
  if (noUnderlineRadio) {
    noUnderlineRadio.checked = true;
  }

  if (i < nextHyperlinkSlot) {
    nextHyperlinkSlot = i;
  }
  var addBtn = document.getElementById("addHyperlinkBtn");
  if (addBtn) {
    addBtn.style.display = "";
  }
}

//Each link row has its own underline/no-underline radio pair (underlineOption1..5)
function getUnderlineChoice(i) {
  var underlineRadio = document.getElementById("underline" + i);
  return underlineRadio && underlineRadio.checked ? "underline" : "none";
}

function hyperLink() {
  //Grab main textarea value
  var inputValueTextFinal = convertedBox.value;

  for (var i = 1; i <= MAX_HYPERLINKS; i++) {
    var hyperLinkText = document.getElementById("hyperLinkText" + i);
    var ColorHex2 = document.getElementById("ColorHex2_" + i);
    if (!hyperLinkText || !ColorHex2) {
      continue;
    }

    var inputValue = hyperLinkText.value;
    //Strip a leading # since it's prepended below
    var ColorHex2Output = ColorHex2.value.replace(/^#/, "");

    validateColorHex2Slot(i);

    //Skip slots with no hyperlink text entered
    if (inputValue.length > 1) {
      inputValueTextFinal = inputValueTextFinal.replace(
        inputValue,
        '<a href="" style="color:#' +
          ColorHex2Output +
          ';text-decoration:' +
          getUnderlineChoice(i) +
          ';">' +
          inputValue +
          "</a>"
      );
    }
  }

  convertedBox.value = inputValueTextFinal;
}

//Escapes regex special characters so a link's raw text can be used inside a RegExp
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

//If slot i has already been converted into an <a> tag in the output, flip its
//text-decoration in place - lets the underline choice update live without
//requiring the user to press Convert again.
function updateUnderlineForSlot(i) {
  var hyperLinkText = document.getElementById("hyperLinkText" + i);
  var ColorHex2 = document.getElementById("ColorHex2_" + i);
  if (!hyperLinkText || !ColorHex2) {
    return;
  }

  var inputValue = hyperLinkText.value;
  if (inputValue.length <= 1) {
    return;
  }

  var ColorHex2Output = ColorHex2.value.replace(/^#/, "");
  var pattern = new RegExp(
    '(<a href="" style="color:#' +
      ColorHex2Output +
      ';text-decoration:)(none|underline)(;">' +
      escapeRegExp(inputValue) +
      "</a>)"
  );

  convertedBox.value = convertedBox.value.replace(
    pattern,
    "$1" + getUnderlineChoice(i) + "$3"
  );
}

//Validate each hyperlink color box on blur, so the warning shows up as soon
//as the user finishes typing rather than only after pressing Convert.
for (var hexSlot = 1; hexSlot <= MAX_HYPERLINKS; hexSlot++) {
  (function (slot) {
    var input = document.getElementById("ColorHex2_" + slot);
    if (input) {
      input.addEventListener("blur", function () {
        validateColorHex2Slot(slot);
      });
    }
  })(hexSlot);
}
