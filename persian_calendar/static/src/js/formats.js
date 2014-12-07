Jalali_Date = {
	g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
};

Jalali_Date.jalaliToGregorian = function(j_y, j_m, j_d)
{

	j_y = parseInt(j_y);
	j_m = parseInt(j_m);
	j_d = parseInt(j_d);
	var jy = j_y-979;
	var jm = j_m-1;
	var jd = j_d-1;

	var j_day_no = 365*jy + parseInt(jy / 33)*8 + parseInt((jy%33+3) / 4);
	for (var i=0; i < jm; ++i) j_day_no += Jalali_Date.j_days_in_month[i];

	j_day_no += jd;

	var g_day_no = j_day_no+79;

	var gy = 1600 + 400 * parseInt(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
	g_day_no = g_day_no % 146097;

	var leap = true;
	if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */
	{
		g_day_no--;
		gy += 100*parseInt(g_day_no/  36524); /* 36524 = 365*100 + 100/4 - 100/100 */
		g_day_no = g_day_no % 36524;

		if (g_day_no >= 365)
			g_day_no++;
		else
			leap = false;
	}

	gy += 4*parseInt(g_day_no/ 1461); /* 1461 = 365*4 + 4/4 */
	g_day_no %= 1461;

	if (g_day_no >= 366) {
		leap = false;

		g_day_no--;
		gy += parseInt(g_day_no/ 365);
		g_day_no = g_day_no % 365;
	}

	for (var i = 0; g_day_no >= Jalali_Date.g_days_in_month[i] + (i == 1 && leap); i++)
		g_day_no -= Jalali_Date.g_days_in_month[i] + (i == 1 && leap);
	var gm = i+1;
	var gd = g_day_no+1;

	return [gy, gm, gd];
}

Jalali_Date.checkDate = function(j_y, j_m, j_d)
{
	return !(j_y < 0 || j_y > 32767 || j_m < 1 || j_m > 12 || j_d < 1 || j_d >
		(Jalali_Date.j_days_in_month[j_m-1] + (j_m == 12 && !((j_y-979)%33%4))));
}

Jalali_Date.gregorianToJalali = function(g_y, g_m, g_d)
{
	g_y = parseInt(g_y);
	g_m = parseInt(g_m);
	g_d = parseInt(g_d);
	var gy = g_y-1600;
	var gm = g_m-1;
	var gd = g_d-1;

	var g_day_no = 365*gy+parseInt((gy+3) / 4)-parseInt((gy+99)/100)+parseInt((gy+399)/400);

	for (var i=0; i < gm; ++i)
	g_day_no += Jalali_Date.g_days_in_month[i];
	if (gm>1 && ((gy%4==0 && gy%100!=0) || (gy%400==0)))
	/* leap and after Feb */
	++g_day_no;
	g_day_no += gd;

	var j_day_no = g_day_no-79;

	var j_np = parseInt(j_day_no/ 12053);
	j_day_no %= 12053;

	var jy = 979+33*j_np+4*parseInt(j_day_no/1461);

	j_day_no %= 1461;

	if (j_day_no >= 366) {
		jy += parseInt((j_day_no-1)/ 365);
		j_day_no = (j_day_no-1)%365;
	}

	for (var i = 0; i < 11 && j_day_no >= Jalali_Date.j_days_in_month[i]; ++i) {
		j_day_no -= Jalali_Date.j_days_in_month[i];
	}
	var jm = i+1;
	var jd = j_day_no+1;


	return [jy, jm, jd];
};

(function() {

var instance = openerp;
openerp.web.formats = {};

var _t = instance.web._t;

//Default config/variables
var VERSION = "0.3.0",
//Check for nodeJS
hasModule = (typeof module !== 'undefined' && module.exports);

    /**
    * PersianJs main class
    *
    * @class PersianJs
    */
    function PersianJs(str) {
        this._str = str;
    }
	/**
    * Used for convert Arabic characters to Persian
    *
    * @api private
    * @method _arabicChar
    * @param {String} value 
    * @return {Object} PersianJs Object
    */
    function _arabicChar(value) {
        if (!value) {
            return;
        }
        var arabicChars = ["ي", "ك", "‍", "دِ", "بِ", "زِ", "ذِ", "ِشِ", "ِسِ", "‌", "ى"],
            persianChars = ["ی", "ک", "", "د", "ب", "ز", "ذ", "ش", "س", "", "ی"];
			
        for (var i = 0, charsLen = arabicChars.length; i < charsLen; i++) {
            value = value.replace(new RegExp(arabicChars[i], "g"), persianChars[i]);
        }
        this._str = value;
        return this;
    }
	
	     /**
     * Used for Change keyboard layout
     *
     * @method _switchKey
     * @param {String} value 
     * @return {String} Returns Converted char
     */
    function _switchKey(value) {
        if (!value) {
            return;
        }
        var persianChar = [ "ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "چ", "ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ک", "گ", "ظ", "ط", "ز", "ر", "ذ", "د", "پ", "و","؟" ],
            englishChar = [ "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", ",","?" ];
 
        for (var i = 0, charsLen = persianChar.length; i < charsLen; i++) {
            value = value.replace(new RegExp(persianChar[i], "g"), englishChar[i]);
        }
        return value;
    }
	    /**
    * Used for convert Arabic numbers to Persian
    *
    * @api private
    * @method _arabicNumber
    * @param {String} value 
    * @return {Object} PersianJs Object
    */
    function _arabicNumber(value) {
        if (!value) {
            return;
        }
        var arabicNumbers = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠"],
            persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"];

        for (var i = 0, numbersLen = arabicNumbers.length; i < numbersLen; i++) {
            value = value.replace(new RegExp(arabicNumbers[i], "g"), persianNumbers[i]);
        }
        this._str = value;
        return this;
    }
	    /**
    * Used for convert English numbers to Persian
    *
    * @api private
    * @method _englishNumber
    * @param {String} value 
    * @return {Object} PersianJs Object
    */
    function _englishNumber(value) {
        if (!value) {
            return;
        }
        var englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
            persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"];

        for (var i = 0, numbersLen = englishNumbers.length; i < numbersLen; i++) {
            value = value.replace(new RegExp(englishNumbers[i], "g"), persianNumbers[i]);
        }
        this._str = value;
        return this;
    }
	function _turn2englishNumber(value) {
        if (!value) {
            return;
        }
        var englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
            persianNumbers = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"];

        for (var i = 0, numbersLen = persianNumbers.length; i < numbersLen; i++) {
            value = value.replace(new RegExp(persianNumbers[i], "g"), englishNumbers[i]);
        }
        this._str = value;
        return this;
    }
    /**
    * Used for fix Persian Charachters in URL
    * https://fa.wikipedia.org/wiki/ãÏíÇæí˜í:Gadget-Extra-Editbuttons-Functions.js
    *
    * @api private
    * @method _fixURL
    * @param {String} value 
    * @return {Object} PersianJs Object
    */
    function _fixURL(value) {
        if (!value) {
            return;
        }
        // Replace every %20 with _ to protect them from decodeURI
        var old = "";
        while (old != value) {
            old = value;
            value = value.replace(/(http\S+?)\%20/g, '$1\u200c\u200c\u200c_\u200c\u200c\u200c');
        }
        // Decode URIs
        // NOTE: This would convert all %20's to _'s which could break some links
        // but we will undo that later on
        value = value.replace(/(http\S+)/g, function (s, p) {
            return decodeURI(p);
        });
        // Revive all instances of %20 to make sure no links is broken
        value = value.replace(/\u200c\u200c\u200c_\u200c\u200c\u200c/g, '%20');
        this._str = value;
        return this;
    }

    var persianJs = function(inputStr) {
        if (!inputStr || inputStr === "") {
            throw new Error("Input is null or empty.");
        }
        return new PersianJs(inputStr);
    };
    
    /**
    * Current PersianJs version
    *
    * @property version 
    * @type String
    */
    persianJs.version = VERSION;

    //Prototype
    persianJs.fn = PersianJs.prototype = {
        clone: function () {
            return persianJs(this);
        },
        value: function () {
            return this._str;
        },
        toString: function () {
            return this._str.toString();
        },
        set : function (value) {
            this._str = String(value);
            return this;
        },
        arabicChar: function() {
            return _arabicChar.call(this, this._str);
        },
        arabicNumber: function() {
            return _arabicNumber.call(this, this._str);
        },
        fixURL: function() {
            return _fixURL.call(this, this._str);
        },
        englishNumber: function() {
            return _englishNumber.call(this, this._str);
        },
		turn2englishNumber: function() {
            return _turn2englishNumber.call(this, this._str);
        },
        switchKey: function() {
            return _switchKey.call(this, this._str);
        }
    };
	
	    //Expose PersianJs
    //CommonJS module is defined
    if (hasModule) {
        module.exports = persianJs;
    }
    //global ender:false
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `persianJs` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode
        this['persianJs'] = persianJs;
    }
	    //global define:false
    if (typeof define === 'function' && define.amd) {
        define('persianJs', [], function () {
            return persianJs;
        });
    }
	
	
	

/**
 * Intersperses ``separator`` in ``str`` at the positions indicated by
 * ``indices``.
 *
 * ``indices`` is an array of relative offsets (from the previous insertion
 * position, starting from the end of the string) at which to insert
 * ``separator``.
 *
 * There are two special values:
 *
 * ``-1``
 *   indicates the insertion should end now
 * ``0``
 *   indicates that the previous section pattern should be repeated (until all
 *   of ``str`` is consumed)
 *
 * @param {String} str
 * @param {Array<Number>} indices
 * @param {String} separator
 * @returns {String}
 */
instance.web.intersperse = function (str, indices, separator) {
    separator = separator || '';
    var result = [], last = str.length;

    for(var i=0; i<indices.length; ++i) {
        var section = indices[i];
        if (section === -1 || last <= 0) {
            // Done with string, or -1 (stops formatting string)
            break;
        } else if(section === 0 && i === 0) {
            // repeats previous section, which there is none => stop
            break;
        } else if (section === 0) {
            // repeat previous section forever
            //noinspection AssignmentToForLoopParameterJS
            section = indices[--i];
        }
        result.push(str.substring(last-section, last));
        last -= section;
    }

    var s = str.substring(0, last);
    if (s) { result.push(s); }
    return result.reverse().join(separator);
};
/**
 * Insert "thousands" separators in the provided number (which is actually
 * a string)
 *
 * @param {String} num
 * @returns {String}
 */
instance.web.insert_thousand_seps = function (num) {
    var negative = num[0] === '-';
    num = (negative ? num.slice(1) : num);
    return (negative ? '-' : '') + instance.web.intersperse(
        num, _t.database.parameters.grouping, _t.database.parameters.thousands_sep);
};

/**
 * removes literal (non-format) text from a date or time pattern, as datejs can
 * not deal with literal text in format strings (whatever the format), whereas
 * strftime allows for literal characters
 *
 * @param {String} value original format
 */
instance.web.strip_raw_chars = function (value) {
    var isletter = /[a-zA-Z]/, output = [];
    for(var index=0; index < value.length; ++index) {
        var character = value[index];
        if(isletter.test(character) && (index === 0 || value[index-1] !== '%')) {
            continue;
        }
        output.push(character);
    }
    return output.join('');
};
var normalize_format = function (format) {
    return Date.normalizeFormat(instance.web.strip_raw_chars(format));
};

/**
 * Check with a scary heuristic if the value is a bin_size or not.
 * If not, compute an approximate size out of the base64 encoded string.
 *
 * @param {String} value original format
 */
instance.web.binary_to_binsize = function (value) {
    if (!value) {
        return instance.web.human_size(0);
    }
    if (value.substr(0, 10).indexOf(' ') == -1) {
        // Computing approximate size out of base64 encoded string
        // http://en.wikipedia.org/wiki/Base64#MIME
        return instance.web.human_size(value.length / 1.37);
    } else {
        // already bin_size
        return value;
    }
};

/**
 * Returns a human readable size
 *
 * @param {Number} numner of bytes
 */
instance.web.human_size = function(size) {
    var units = _t("Bytes,Kb,Mb,Gb,Tb,Pb,Eb,Zb,Yb").split(',');
    var i = 0;
    while (size >= 1024) {
        size /= 1024;
        ++i;
    }
    return size.toFixed(2) + ' ' + units[i];
};

/**
 * Formats a single atomic value based on a field descriptor
 *
 * @param {Object} value read from OpenERP
 * @param {Object} descriptor union of orm field and view field
 * @param {Object} [descriptor.widget] widget to use to display the value
 * @param {Object} descriptor.type fallback if no widget is provided, or if the provided widget is unknown
 * @param {Object} [descriptor.digits] used for the formatting of floats
 * @param {String} [value_if_empty=''] returned if the ``value`` argument is considered empty
 */
instance.web.format_value = function (value, descriptor, value_if_empty) {
    // If NaN value, display as with a `false` (empty cell)
    if (typeof value === 'number' && isNaN(value)) {
        value = false;
    }
    //noinspection FallthroughInSwitchStatementJS
    switch (value) {
        case '':
            if (descriptor.type === 'char' || descriptor.type === 'text') {
                return '';
            }
            console.warn('Field', descriptor, 'had an empty string as value, treating as false...');
            return value_if_empty === undefined ?  '' : value_if_empty;
        case false:
        case undefined:
        case Infinity:
        case -Infinity:
            return value_if_empty === undefined ?  '' : value_if_empty;
    }
    var l10n = _t.database.parameters;
    switch (descriptor.widget || descriptor.type || (descriptor.field && descriptor.field.type)) {
        case 'id':
            return value.toString();
		case 'char':
			//if (l10n.direction=='rtl'){return persianJs(_.str.sprintf('%s', value)).englishNumber().toString();}
			return value;
        case 'integer':
            var a = instance.web.insert_thousand_seps( _.str.sprintf('%d', value));
			if (l10n.direction=='rtl'){return persianJs(a).englishNumber().toString();}
			return a;
        case 'float':
            var digits = [0,0]//descriptor.view_digits ? descriptor.digits : [2,2];
            digits = typeof digits === "string" ? py.eval(digits) : digits;
            var precision = digits[1];
            var formatted = _.str.sprintf('%.' + precision + 'f', value).split('.');
			if (l10n.direction=='rtl')
			{
				formatted[0] = persianJs(formatted[0]).englishNumber().toString();
				if (formatted[1]) {formatted[1] = persianJs(formatted[1]).englishNumber().toString();}
			}
			
            formatted[0] = instance.web.insert_thousand_seps(formatted[0]);
            return formatted.join(l10n.decimal_point);
        case 'float_time':
            var pattern = '%02d:%02d';
            if (value < 0) {
                value = Math.abs(value);
                pattern = '-' + pattern;
            }
            var hour = Math.floor(value);
            var min = Math.round((value % 1) * 60);
            if (min == 60){
                min = 0;
                hour = hour + 1;
            }
			if (l10n.direction=='rtl'){return persianJs(_.str.sprintf(pattern, hour, min)).englishNumber().toString();}
            return _.str.sprintf(pattern, hour, min);
        case 'many2one':
            // name_get value format
            return value[1] ? value[1].split("\n")[0] : value[1];
        case 'one2many':
        case 'many2many':
            if (typeof value === 'string') {
                return value;
            }
            return _.str.sprintf(_t("(%d records)"), value.length);
        case 'datetime':
            if (typeof(value) == "string")
                value = instance.web.auto_str_to_date(value);
							
			if (l10n.direction=='rtl'){
				var a =  value.toString(normalize_format("%Y/%m/%d") + ' ' + normalize_format("%H:%M"));
				var dateTime = a.split(" ");
				var date  = dateTime[0];
				var time = dateTime[1];
				var date_split = date.split('/');
				var jdate = Jalali_Date.gregorianToJalali(date_split[0],date_split[1],date_split[2]);
				jdate = _.str.sprintf('%s %s/%s/%s', time,jdate[0], ("0" + jdate[1].toString()).slice(-2),("0" + jdate[2].toString()).slice(-2))
				return persianJs(jdate).englishNumber().toString();
			}

            return value.toString(normalize_format(l10n.date_format)
                        + ' ' + normalize_format(l10n.time_format));
        case 'date':
            if (typeof(value) == "string")
                value = instance.web.str_to_date(value.substring(0,10));
            var a = value.toString(normalize_format(l10n.date_format));
			if (l10n.direction=='rtl'){
				a = value.toString(normalize_format("%Y/%m/%d"));
				var date_split = a.split('/');
				jdate = Jalali_Date.gregorianToJalali(date_split[0],date_split[1],date_split[2]);
				jdate = _.str.sprintf('%s/%s/%s', jdate[0], ("0" + jdate[1].toString()).slice(-2),("0" + jdate[2].toString()).slice(-2))
				return persianJs(jdate).englishNumber().toString();
			}
			return a;
        case 'time':
            if (typeof(value) == "string")
              value = instance.web.auto_str_to_date(value);
			if (l10n.direction=='rtl'){return persianJs(value.toString(normalize_format(l10n.time_format))).englishNumber().toString();}
            return value.toString(normalize_format(l10n.time_format));
        case 'selection': case 'statusbar':
            // Each choice is [value, label]
            if(_.isArray(value)) {
                 return value[1];
            }
            var result = _(descriptor.selection).detect(function (choice) {
                return choice[0] === value;
            });
            if (result) { return result[1]; }
            return;
        default:
			//if (l10n.direction=='rtl'){return persianJs(_.str.sprintf('%s', value)).englishNumber().toString();}
            return value;
    }
};

instance.web.parse_value = function (value, descriptor, value_if_empty) {
    var date_pattern = normalize_format(_t.database.parameters.date_format),
        time_pattern = normalize_format(_t.database.parameters.time_format);
    switch (value) {
        case false:
        case "":
            return value_if_empty === undefined ?  false : value_if_empty;
    }
    var tmp;
    var l10n = instance.web._t.database.parameters;
    switch (descriptor.widget || descriptor.type || (descriptor.field && descriptor.field.type)) {
		case 'char':
			if (l10n.direction=='rtl'){ value =  persianJs(value).turn2englishNumber().toString();}
			return value;
        case 'integer':
			if (l10n.direction=='rtl'){ value =  persianJs(value).turn2englishNumber().toString();}
            do {
                tmp = value;
                //value = value.replace(instance.web._t.database.parameters.thousands_sep, "");
            } while(tmp !== value);
            tmp = Number(value);
            // do not accept not numbers or float values
            if (isNaN(tmp) || tmp % 1)
                throw new Error(_.str.sprintf(_t("'%s' is not a correct integer"), value));
            return tmp;
        case 'float':
			if (l10n.direction=='rtl'){ value =  persianJs(value).turn2englishNumber().toString();}
            tmp = Number(value);
            if (!isNaN(tmp))
                return tmp;

            var tmp2 = value;
            do {
                tmp = tmp2;
                tmp2 = tmp.replace(instance.web._t.database.parameters.thousands_sep, "");
            } while(tmp !== tmp2);
            var reformatted_value = tmp.replace(instance.web._t.database.parameters.decimal_point, ".");
            var parsed = Number(reformatted_value);
            if (isNaN(parsed))
                throw new Error(_.str.sprintf(_t("'%s' is not a correct float"), value));
            return parsed;
        case 'float_time':
			if (l10n.direction=='rtl'){ value =  persianJs(value).turn2englishNumber().toString();}
            var factor = 1;
            if (value[0] === '-') {
                value = value.slice(1);
                factor = -1;
            }
            var float_time_pair = value.split(":");
            if (float_time_pair.length != 2)
                return factor * instance.web.parse_value(value, {type: "float"});
            var hours = instance.web.parse_value(float_time_pair[0], {type: "integer"});
            var minutes = instance.web.parse_value(float_time_pair[1], {type: "integer"});
            return factor * (hours + (minutes / 60));
        case 'progressbar':
            return instance.web.parse_value(value, {type: "float"});
        case 'datetime':
			if (l10n.direction=='rtl'){
				value =  persianJs(value).turn2englishNumber().toString();
				var dateTime = value.split(" ");
				var date  = dateTime[1];
				var time = dateTime[0];
				var date_split = date.split('/');
				var jdate = Jalali_Date.jalaliToGregorian(date_split[0],date_split[1],date_split[2]);
				value = _.str.sprintf('%s/%s/%s %s', jdate[0], ("0" + jdate[1].toString()).slice(-2),("0" + jdate[2].toString()).slice(-2),time)
			}
			
            var datetime = Date.parseExact(
                    value, (date_pattern + ' ' + time_pattern));
            if (datetime !== null)
                return instance.web.datetime_to_str(datetime);
            datetime = Date.parseExact(value.toString().replace(/\d+/g, function(m){
                return m.length === 1 ? "0" + m : m ;
            }), (date_pattern + ' ' + time_pattern));
            if (datetime !== null)
                return instance.web.datetime_to_str(datetime);
            datetime = Date.parse(value);
            if (datetime !== null)
                return instance.web.datetime_to_str(datetime);
            throw new Error(_.str.sprintf(_t("'%s' is not a correct datetime"), value));
        case 'date':
			console.log('1');
			console.log(l10n.direction);

			if (l10n.direction=='rtl'){
				console.log('2')
				value =  persianJs(value).turn2englishNumber().toString();
				var date_split = value.split('/');
				var gdate = Jalali_Date.jalaliToGregorian(date_split[0],date_split[1],date_split[2]);
				gdate = _.str.sprintf('%s/%s/%s', gdate[0], ("0" + gdate[1].toString()).slice(-2),("0" + gdate[2].toString()).slice(-2));
				return gdate;
			}
			var date = Date.parseExact(value, date_pattern);
            if (date !== null)
                return instance.web.date_to_str(date);
            date = Date.parseExact(value.toString().replace(/\d+/g, function(m){
                return m.length === 1 ? "0" + m : m ;
            }), date_pattern);
            if (date !== null)
                return instance.web.date_to_str(date);
            date = Date.parse(value);
            if (date !== null)
                return instance.web.date_to_str(date);
            throw new Error(_.str.sprintf(_t("'%s' is not a correct date"), value));
        case 'time':
			if (l10n.direction=='rtl'){ value =  persianJs(value).turn2englishNumber().toString();}

            var time = Date.parseExact(value, time_pattern);
            if (time !== null)
                return instance.web.time_to_str(time);
            time = Date.parse(value);
            if (time !== null)
                return instance.web.time_to_str(time);
            throw new Error(_.str.sprintf(_t("'%s' is not a correct time"), value));
    }
	//if (l10n.direction=='rtl'){ value =  persianJs(value).turn2englishNumber().toString();}
    return value;
};

instance.web.auto_str_to_date = function(value, type) {
    try {
        return instance.web.str_to_datetime(value);
    } catch(e) {}
    try {
        return instance.web.str_to_date(value);
    } catch(e) {}
    try {
        return instance.web.str_to_time(value);
    } catch(e) {}
    throw new Error(_.str.sprintf(_t("'%s' is not a correct date, datetime nor time"), value));
};

instance.web.auto_date_to_str = function(value, type) {
    switch(type) {
        case 'datetime':
            return instance.web.datetime_to_str(value);
        case 'date':
            return instance.web.date_to_str(value);
        case 'time':
            return instance.web.time_to_str(value);
        default:
            throw new Error(_.str.sprintf(_t("'%s' is not convertible to date, datetime nor time"), type));
    }
};

/**
 * performs a half up rounding with arbitrary precision, correcting for float loss of precision
 * See the corresponding float_round() in server/tools/float_utils.py for more info
 * @param {Number} the value to be rounded
 * @param {Number} a precision parameter. eg: 0.01 rounds to two digits.
 */
instance.web.round_precision = function(value, precision){
    if (!value) {
        return 0;
    } else if (!precision || precision < 0) {
        precision = 1;
    }
    var normalized_value = value / precision;
    var epsilon_magnitude = Math.log(Math.abs(normalized_value))/Math.log(2);
    var epsilon = Math.pow(2, epsilon_magnitude - 53);
    normalized_value += normalized_value >= 0 ? epsilon : -epsilon;
    var rounded_value = Math.round(normalized_value);
    return rounded_value * precision;
};

/**
 * performs a half up rounding with a fixed amount of decimals, correcting for float loss of precision
 * See the corresponding float_round() in server/tools/float_utils.py for more info
 * @param {Number} the value to be rounded
 * @param {Number} the number of decimals. eg: round_decimals(3.141592,2) -> 3.14
 */
instance.web.round_decimals = function(value, decimals){
    return instance.web.round_precision(value, Math.pow(10,-decimals));
};

})();
