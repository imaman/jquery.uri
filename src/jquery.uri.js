
/*
Copyright (c) 2009, Itay Maman
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


/**
   jquery.uri(uriString) - A JQuery plugin for inspecting and manipulating a URI.
   
   Typical usage example:
      var uri = $.uri(window.location.href); // Assuming current url is "http://api.jquery.com"
      uri.params.format = "xml";
      window.location.replace(uri.toString()); // Will forward the browser to "http://api.jquery.com?format=xml"

   Parameters: uriString - Input string
   Returnss: an object, containing the following properties and methods:
     
   - protocol : String
      If originating URL is 'http://api.jquery.com:8080/category/core?format=json'  then protocol is 'http'
            
   - domain : String
      If originating URL is 'http://api.jquery.com:8080/category/core?format=json'  then domain is 'api.jquery.com'
            
   - port : String
      If originating URL is 'http://api.jquery.com:8080/category/core?format=json'  then port is '8080'
            
   - path : String
      If originating URL is 'http://api.jquery.com:8080/category/core?format=json'  then path is 'category/core'
            
   - params : Object
      The parameters specified at the URL as a map (parameter name -> parameter value). Names and values are decoded
      via decodeURIComponent().
      If originating URL is 'http://api.jquery.com:8080/category/core?format=json'  then params == { "format": "json" }

   - fragment : String
      If originating URL is 'http://api.jquery.com:8080/category/core?format=json#sec3'  then fragment is 'sec3'
         
   - toString(compareFunction)
      Return a well-formed URL representing this object.
      Unspecified components (e.g, if this.port == '') do not appear at the result.
      Caller can pass a compareFunction to affect the order of the query part at the result ('?p1=v1&p2=v2'). This function takes 
      two arguments, a and b, each of which is an object of the form { key: k, value: v } representing the name and value of a param from this.params.
      the function should return -1 if a should appear before b, +1 if a should appear after b, or 0 otherwise.
         
   - clone() 
      Return a new instance identical to this. All fields in the new instance have the same values as in this, 
      except for params which points at a fresh map, populated with the exact key,value mappings as in this.params.
      This allows client code to synthesize a new URL from an existing URL without affecting the existing one.
*/
(function ($) {
   $._uri = function(line) {
      
      line = line.toString();
      var splitAround = function(s, left, separator, right) {
         var result = {};
         var index = s.indexOf(separator);
         if(index < 0) {
            result[left] = s;
            result[right] = '';
         }
         else {
            result[left] = s.substring(0, index);
            result[right] = s.substring(index + separator.length);
         }
         
         result.toString = function() { 
            return "'" + result[left] + "', '" + result[right] + "'";
         }
         
         return result;
      };
      
      var extractParams = function(query) {
         var result = {};
         
         var pairs =  query.split("&") || [];
         $.each(pairs, function(i, pair) {
            if(pair.length <= 0)
               return true;
            var keyValue = splitAround(pair, "key", "=", "value");
            var k = decodeURIComponent(keyValue.key);
            var v = decodeURIComponent(keyValue.value);
            result[k] = v;
         });

         return result;
      };
      
      var adjustMissingProtocol = function(protocolDomainPortPath) {
         if(!protocolDomainPortPath.domainPortPath) {
            protocolDomainPortPath.domainPortPath = protocolDomainPortPath.protocol;
            protocolDomainPortPath.protocol = "";
         }
      };
      
      var addressRest = splitAround(line, "address", "?", "rest");
      
      if(!addressRest.rest) {
         addressRest = splitAround(line, "address", "#", "rest");          
         // Re-insert the '#' symbol since we need to break-apart the query from the fragment later
         addressRest.rest = '#' + addressRest.rest;
      }
         
      var queryFragment = splitAround(addressRest.rest, "query", "#", "fragment");

      var protocolDomainPortPath = splitAround(addressRest.address, "protocol", "://", 
         "domainPortPath");
         
      adjustMissingProtocol(protocolDomainPortPath);
      
      var domainPortPath = splitAround(protocolDomainPortPath.domainPortPath, 
         "domainPort", "/", "path");
      var domainPort = splitAround(domainPortPath.domainPort, "domain", ":", "port");
      domainPortPath.path = domainPortPath.path.replace(/\/+$/, "");
      

      var surround = function(left, s, right) {
         right = right || "";
         return s == null || s.length == 0 ? "" : left + s + right;
      }
      
      return { 
         
         protocol : protocolDomainPortPath.protocol,          
         domain : domainPort.domain,      
         port : domainPort.port,         
         path : domainPortPath.path,         
         params: extractParams(queryFragment.query), 
         fragment : queryFragment.fragment,
         
         toString: function(compareFunction) {

      
            var arr = [];
            $.each(this.params, function(k, v) {
               var x = { key: k, value: v };
               arr.push(x);
            });
            
            if(compareFunction)
               arr.sort(compareFunction);
            
            var q = "";
            $.each(arr, function(index, kv) {
               q += q.length > 0 ? "&" : "";
               q += encodeURIComponent(kv.key) + "=" + encodeURIComponent(kv.value);
            });
            
            return surround("", this.protocol, "://") + surround("", this.domain) 
               + surround(":", this.port) + surround("/", this.path) + surround("?", q);
         },         
         
         clone: function() {
            var result = $.extend({}, this);
            result.params = $.extend({}, this.params);
            return result;
         }
      };         
   }
   
   function set(obj, part, value) {
      checkLegalPart(part);
      var temp = obj.clone();
      temp[part] = value;
      return build(temp);
   }
   
   function setOptions(obj, options) {
      var res = obj;
      $.each(options, function(key, value) {
         res = res.at(key, value);
         return true;
      });
      
      return res;     
   }

   
   function checkLegalPart(part) {
      var parts = ["protocol", "domain", "port", "path", "query", "fragment"];
      if($.inArray(part, parts) == -1) 
         throw "Unknown URI part '" + part + "'";
   }
   
   function get(obj, part) {
      checkLegalPart(part);               
      if(part == "query")
         return $.extend({}, obj.params);
      
      return obj[part] 
   }
   
   function build(xUri) {
      xUri.at = function(part, value) {
      
         if(arguments.length == 2) 
            return set(xUri, part, value);
         
         if($.isPlainObject(part)) 
            return setOptions(xUri, part);
         
         return get(xUri, part);
      }
      
      return xUri;     
   }
   
   $.uri = function(x) {
      return build($._uri(x));
      
   } 
})(jQuery);


