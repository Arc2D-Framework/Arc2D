/**
 * Este - EcmaScript Template Engine
 * DEMO: http://erik.eae.net/playground/este/estetest.html
 *       http://erik.eae.net/archives/2005/05/27/01.03.26/
 *       
 *
 * Copyright 2005 Erik Arvidsson
 *
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * This is a very basic javascript template writer. It follows the jsp syntax
 * and allows code to be intermixed with text using '<% expr %>' and
	'<% = stringExpr %>' In the template there is an object called 'out' wich is a
 * object that has 2 methods, 'write' and 'writeln'. You can pass your own
 * writer object to the template engine (for example the document object in
 * HTML).
 *
 * Example using JSON (assuming we have a readTextFile function) and setting the
 * innerHTML of an element
 *
 *   var el = document.getElementById("out");
 *   var templateString = readTextFile("mytemplate.txt");
 *   var jsonString = readTextFile("getdata.cgi");
 *   el.innerHTML = TemplateEngine.parse(templateString, null, jsonString);
 *
 * Example using document as the writer (this only works during the load phase
 * of an HTML document
 *
 *   var templateString = readTextFile("mytemplate.txt");
 *   TemplateEngine.parse(templateString, document);
 *
 * @constructor
 * @param {String} opt_template String to act as template
 * @param {TemplateEngine.TextWriter} opt_writer An object that implements write
 *                                               and writeln.
 */
function TemplateEngine(opt_template, opt_writer) {
  this.template = opt_template || "";
  this.writer = opt_writer;
  if (opt_template) {
    this.parse();
  }
};

/**
 * This is the template string used
 * @type String
 */
TemplateEngine.prototype.template = null;

/**
 * This is the writer object used (this is called out inside the template)
 * @type TemplateEngine.TextWriter
 */
TemplateEngine.prototype.writer = null;

/**
 * This is the result javascript code that parse generates.
 * @type String
 */
TemplateEngine.prototype.expression = null;

/**
 * This parses the template text
 * @param {String} opt_template The text to use as the template. This is
 *     optional and if not used the template field is used instead.
 */
TemplateEngine.prototype.parse = function(opt_template) {
  var expr = new TemplateEngine.TextWriter;
  var i = 0, j;
  var s = String(opt_template || this.template);
  while (i < s.length) {
    j = s.indexOf("<%", i);
    if (j == -1) {
      this._addWrite(expr, s.substr(i));
      break;
    } else {
      this._addWrite(expr, s.substring(i, j));
      i = j;
    }
    j = s.indexOf("%>", i);
    if (j == -1) {
      throw "Missing '%>' at end of template";
    }
    this._addCode(expr, s.substring(i + 2, j));
    i = j + 2;
  }
  this.expression = expr.toString();
};

/**
 * This evaluates the template and returns the string representation of the
 * writer.
 * @param {TemplateEngine.TextWriter} opt_writer The object to use for writing.
 *     This is called out inside the template.This is optional and if not used
 *     the writer field is used instead.
 * @param {Object} opt_data This allows you to pass a javascript hash as data
 *     that you can then access from the template. If thisis a string it will
 *     first be evaluated as a JSON structure.
 */
TemplateEngine.prototype.evaluate = function(opt_writer, opt_data) {
  var out = opt_writer || this.writer || new TemplateEngine.TextWriter;
  if (!("write" in out)) {
    throw "Writer does not have an write method";
  }
  if (!("writeln" in out)) {
    throw "Writer does not have an writeln method";
  }
  if (opt_data) {
    if (typeof opt_data == "string") {
      opt_data = eval("(" + opt_data + ")");
    }
    with (opt_data) {
      eval(this.expression);
    }
  } else {
    eval(this.expression);
  }
  return out.toString();
};

/**
 * This static method takes a template string and an optional writer object and
 * returns the resulting string.
 * @param {String} template The template string
 * @param {TemplateEngine.TextWriter} writer The object to write to.
 * @param {Object} opt_data This allows you to pass a javascript hash as data
 *     that you can then access from the template. If this is a string it will
 *     first be evaluated as a JSON structure.
 * @return {String}
 */
TemplateEngine.parse = function(template, writer, opt_data) {
  var jst = new TemplateEngine;
  jst.parse(template);
  return jst.evaluate(writer, opt_data);
};

/// @nodoc
TemplateEngine.prototype._addWrite = function(exprWriter, text) {
  if (text.length == 0) {
    return;
  }
  exprWriter.write("out.write(\"" + text.replace(/\\|\"|\n|\r/g, function(s) {
    switch (s) {
      case "\\":
        return "\\\\";
      case "\"":
        return "\\\"";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
    }
  }) + "\");");
};

/// @nodoc
TemplateEngine.prototype._addCode = function(exprWriter, text) {
  if (text.charAt(0) == "=") {
    exprWriter.write("out.write(" + text.substr(1) + ");");
  } else if (text.charAt("0") == "-" && text.charAt(1) == "-") {
    if (text.charAt(text.length - 1) != "-" ||
        text.charAt(text.length - 2) != "-") {
      throw "Incorrect template comment";
    }
  } else {
    exprWriter.write(text);
  }
};

/**
 * This is an internal class that is used to write text.
 * @constructor
 */
TemplateEngine.TextWriter = function() {
  this._text = "";
  this._sb = [];
};

/**
 * Writes a string to the buffer
 * @param s : String  The text to write
 * @returns void
 */
TemplateEngine.TextWriter.prototype.write = function(s) {
  this._sb.push(s);
};

/**
 * Writes a string folleowed by a new line to the buffer
 * @param s : String  The text to write
 * @returns void
 */
TemplateEngine.TextWriter.prototype.writeln = function(s) {
  this._sb.push(s + "\n");
};

/**
 * This returns the string of the all the text written to the writer
 * @returns String
 */
TemplateEngine.TextWriter.prototype.toString = function() {
  this._text = this._sb.join("");
  this._sb = [];
  return this._text;
};

TemplateEngine.parseTemplate = function(template, opt_data, writer){
    return TemplateEngine.parse(template, writer, opt_data);
};
