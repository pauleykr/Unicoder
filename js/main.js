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

function showunLinkheckbox(checkbox) {
  var k = document.getElementById("unlinkFields");
  k.classList.toggle("hyperlink-display", checkbox.checked);
  k.classList.toggle("hyperlink-hide", !checkbox.checked);
}

//Each ".select-all" checkbox toggles every other checkbox in its enclosing
//<ul>; member checkboxes' own onclick (eg. showunLinkheckbox) still fires so
//their dependent fields stay in sync. The master also reflects manual
//per-checkbox changes, checking itself only once every member is checked.
function setupCheckAllSections() {
  document.querySelectorAll(".select-all").forEach(function (master) {
    var container = master.closest("ul");
    if (!container) {
      return;
    }
    var members = Array.prototype.slice
      .call(container.querySelectorAll('input[type="checkbox"]'))
      .filter(function (cb) {
        return cb !== master;
      });

    master.addEventListener("change", function () {
      members.forEach(function (cb) {
        if (cb.checked !== master.checked) {
          cb.checked = master.checked;
          if (typeof cb.onclick === "function") {
            cb.onclick();
          }
        }
      });
    });

    members.forEach(function (cb) {
      cb.addEventListener("change", function () {
        master.checked = members.every(function (member) {
          return member.checked;
        });
      });
    });
  });
}
setupCheckAllSections();

//Tooltip icons: click/tap toggles the bubble open (hover still works via CSS,
//this is what makes it reachable on touch devices and via keyboard).
function toggleTooltip(button) {
  var wrap = button.closest(".tooltip-wrap");
  if (!wrap) {
    return;
  }
  var isOpen = wrap.classList.toggle("tooltip-open");
  button.setAttribute("aria-expanded", isOpen);
  if (isOpen) {
    positionTooltip(wrap);
  }
}

//Flips the bubble to hug the right/top edge of its icon instead of the
//left/bottom edge once the default placement would run off the viewport.
function positionTooltip(wrap) {
  wrap.classList.remove("tooltip-align-right", "tooltip-align-top");
  var tooltip = wrap.querySelector(".tooltip-text");
  if (!tooltip) {
    return;
  }
  var rect = tooltip.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    wrap.classList.add("tooltip-align-right");
  }
  if (rect.bottom > window.innerHeight) {
    wrap.classList.add("tooltip-align-top");
  }
}

//Hover and keyboard focus reveal the tooltip purely via CSS, so reposition
//on those events too (not just the click path above).
document.querySelectorAll(".tooltip-wrap").forEach(function (wrap) {
  wrap.addEventListener("mouseenter", function () {
    positionTooltip(wrap);
  });
  wrap.addEventListener("focusin", function () {
    positionTooltip(wrap);
  });
});

document.addEventListener("click", function (event) {
  document.querySelectorAll(".tooltip-wrap.tooltip-open").forEach(function (wrap) {
    if (!wrap.contains(event.target)) {
      wrap.classList.remove("tooltip-open");
      var button = wrap.querySelector(".info-icon");
      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    }
  });
});

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

  clearAllColorWarnings();

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
  var boxCheck = document.querySelectorAll(
    "input[type='checkbox']:not(.select-all)"
  );
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
  RemoveSpace = RemoveSpace.replace(RegExp("\n", "g"), "<br>\n");

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

  //US/Canada-style numbers: optional +1 country code, optional parens
  //around the area code, optional separators (or none, for a bare 10-digit
  //run), and an optional extension ("ext. 123" or "x123").
  var usPhone =
    "(?<!\\d)(?:\\+?1[\\s.-]?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}(?:\\s?(?:ext\\.?|x)\\s?\\d{1,6})?(?!\\d)";
  //International numbers: + country code followed by 2-5 groups of 2-4 digits,
  //covering formats like +44 20 7946 0958 or +91 98765 43210.
  var intlPhone = "(?<!\\d)\\+\\d{1,3}(?:[\\s.-]?\\d{2,4}){2,5}(?!\\d)";

  //Street addresses: house number + street name + a common street-type
  //suffix, with an optional unit/suite and an optional city, state, ZIP.
  var streetTypes =
    "Street|St|Avenue|Ave|Boulevard|Blvd|Drive|Dr|Lane|Ln|Road|Rd|Court|Ct|Circle|Cir|Place|Pl|Square|Sq|Terrace|Ter|Way|Parkway|Pkwy|Highway|Hwy|Trail|Trl|Loop|Crossing|Xing|Point|Pt|Pike|Walk|Path|Plaza|Plz|Alley|Aly|Cove|Cv|Ridge|Rdg";
  var unit = "(?:,?\\s*(?:Apt|Suite|Ste|Unit|#)\\.?\\s*[\\w-]+)?";
  //Commas before the city and before the state are both optional, so this
  //catches "St, Springfield, IL 62704", "St Springfield, IL 62704", and
  //"St Springfield IL 62704" alike - it only ever applies after a street match.
  var cityStateZip =
    "(?:,?\\s*[A-Za-z][A-Za-z.]*(?:\\s+[A-Za-z][A-Za-z.]*)*,?\\s*[A-Z]{2}\\s*\\d{5}(?:-\\d{4})?)?";
  var address =
    "(?<!\\d)\\d{1,6}\\s+[A-Za-z0-9.'-]+(?:\\s+[A-Za-z0-9.'-]+){0,3}\\s+(?:" +
    streetTypes +
    ")\\.?" +
    unit +
    cityStateZip;

  var RegexContactInfo = new RegExp(
    "(" + intlPhone + "|" + usPhone + "|" + address + ")",
    "gi"
  );

  //grab input values
  var className = document.getElementById("className");
  var ColorHex = document.getElementById("ColorHex");

  var classNameValue = className.value;
  var ColorHexValue = ColorHex.value;

  validateColorHex();

  Links = Links.replace(
    RegexContactInfo,
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

function clearAllColorWarnings() {
  var colorHexWarning = document.getElementById("colorHexWarning");
  if (colorHexWarning) {
    colorHexWarning.textContent = "";
  }
  for (var i = 1; i <= MAX_HYPERLINKS; i++) {
    var warningBox = document.getElementById("colorHex2Warning_" + i);
    if (warningBox) {
      warningBox.textContent = "";
    }
  }
}

//Validates the auto-link prevention's Color field and shows/clears its own
//warning, so feedback appears right under that color box once the user is
//done typing.
function validateColorHex() {
  var ColorHex = document.getElementById("ColorHex");
  var warningBox = document.getElementById("colorHexWarning");
  if (!ColorHex || !warningBox) {
    return;
  }

  var ColorHexOutput = ColorHex.value.replace(/^#/, "");
  warningBox.textContent =
    ColorHexOutput.length > 0 && !isValidHexColor(ColorHexOutput)
      ? "Hex color is most compatible for email."
      : "";
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

//Validate the auto-link prevention's Color box on blur, so the warning shows
//up as soon as the user finishes typing rather than only after pressing Convert.
var colorHexInput = document.getElementById("ColorHex");
if (colorHexInput) {
  colorHexInput.addEventListener("blur", validateColorHex);
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

//Mobile bottom sheet: below the CSS breakpoint, .containerR becomes a
//draggable sheet opened by the fixed "Transform Text" bar. Each option
//group's existing <ul> collapses independently off its own <h4> - there's
//no wizard step order, so any combination of groups can stay open at once.
(function () {
  var containerR = document.getElementById("containerR");
  var scrim = document.getElementById("sheetScrim");
  var mobileTransformBtn = document.getElementById("mobileTransformBtn");
  var sheetClose = document.getElementById("sheetClose");
  var sheetApply = document.getElementById("sheetApply");
  var sheetReset = document.getElementById("sheetReset");
  var dragHandle = document.getElementById("dragHandle");

  if (!containerR || !mobileTransformBtn) {
    return;
  }

  function openSheet() {
    containerR.classList.add("sheet-open");
    scrim.classList.add("open");
    sheetClose.focus();
  }
  function closeSheet() {
    containerR.classList.remove("sheet-open");
    scrim.classList.remove("open");
    mobileTransformBtn.focus();
  }

  mobileTransformBtn.addEventListener("click", openSheet);
  sheetClose.addEventListener("click", closeSheet);
  scrim.addEventListener("click", closeSheet);

  document.querySelectorAll("h4.group-head").forEach(function (head) {
    function toggle() {
      var group = head.closest("ul");
      var collapsed = group.classList.toggle("collapsed");
      head.setAttribute("aria-expanded", !collapsed);
    }
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });

  //Apply runs the real ConversionTrigger() used by the desktop Convert
  //button, then closes the sheet so the result is visible underneath.
  window.applyFromSheet = function () {
    ConversionTrigger();
    closeSheet();
  };

  sheetReset.addEventListener("click", function () {
    document
      .querySelectorAll("#containerR input[type='checkbox']:not(.select-all)")
      .forEach(function (cb) {
        cb.checked = false;
        cb.dispatchEvent(new Event("change"));
        //Mirrors setupCheckAllSections' own cascade so unlink/hyperlink
        //field visibility (wired via onclick, not change) resets too.
        if (typeof cb.onclick === "function") {
          cb.onclick();
        }
      });
    var noChange = document.getElementById("transform15");
    var noSup = document.getElementById("transform17");
    if (noChange) {
      noChange.checked = true;
    }
    if (noSup) {
      noSup.checked = true;
    }
  });

  //Drag the handle to dismiss, matching the native iOS/Android sheet gesture.
  var dragStartY = 0;
  var dragging = false;

  function onPointerDown(event) {
    dragging = true;
    dragStartY = event.clientY;
    containerR.classList.add("dragging");
  }
  function onPointerMove(event) {
    if (!dragging) {
      return;
    }
    var delta = Math.max(0, event.clientY - dragStartY);
    containerR.style.transform = "translateY(" + delta + "px)";
  }
  function onPointerUp(event) {
    if (!dragging) {
      return;
    }
    dragging = false;
    containerR.classList.remove("dragging");
    var delta = Math.max(0, event.clientY - dragStartY);
    containerR.style.transform = "";
    if (delta > 110) {
      closeSheet();
    }
  }

  dragHandle.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
})();
