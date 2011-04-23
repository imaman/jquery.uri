
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
   jquery.uri(uriString) - A JQuery plugin for inspecting and manipulating a URI or a URL.
   
   Typical usage example:
      var uri = $.uri(window.location.href); 
      // Assuming current url is "http://api.jquery.com"
      
      var newUri = uri.at({path: "main/index.html", query: { format: "xml" }};
      window.location.replace(newUri); 
         // Will forward the browser to "http://api.jquery.com/main/index.html?format=xml"

   Parameters: uriString - Input string
   Returns: An immutable object, providing the following methods:
     
   - at: function(part) 
      Return the value of the specified URI part. part can be any one 
      of the following strings: "protocol", "domain", "port", "path", "query", 
      "fragment". Any other value yields an exception. 
       
      The "query" part returns an object that maps parameter names to their values,
      as specified by at the query part of the URI. All names and values are 
      decoded via decodeURIComponent(). A "defensive getter" semantics is used so 
      the returned object can be subsequently mutated by the caller without 
      affecting this.             

   Example:       
      var uri = $.uri('http://jquery.com:8080/main/index.html?format=json#top');
      assert uri.at('protocol') == 'http'
      assert uri.at('domain') == 'jquery.com'
      assert uri.at('port') == '8080'
      assert uri.at('path') == 'main/index.html'
      assert uri.at('query') == { 'format': 'json' }
      assert uri.at('fragment') == 'top'
          
   - at: function(part, value)
      Set the value of a URI part.
      Returns a new instance similar to this one except that the specified URI 
      part is now set to value. The receiving object is unchanged. part can 
      be any one of the following strings: "protocol", "domain", "port", "path", 
      "query", "fragment". Any other value yields an exception. 
        
      Example:       
         var uri = $.uri('http://api.jquery.com:8080/main/index.html?format=json');
         uri = uri.at('port', '2020').at('path', 'welcome.html');
         assert uri.at('port') == '2020'
         assert uri.at('path') == 'welcome.html'
       
      if part == "query" then value should be an object. Properties of this object
      provide new name,value mapping for the "query" part at the returned object.
      A new mapping will override an existing mapping (with the same name). Existing
      mapping that were not overridden will be available in the new instance. A 
      "defensive setter" semantics is used so value can be subsequently mutated 
      by the caller without affecting this. 

      Example:       
         var uri = $.uri('http://api.jquery.com?a=1&b=2');
         uri = uri.at('query', { b:200, c:300 });
         assert uri.at('query').a == 1;
         assert uri.at('query').b == 200;
         assert uri.at('query').c == 300;

   - at: function(object)
      Set the values of several URI parts and/or query parameters.      
      Returns a new instance similar to this one except that all name,value 
      mappings specified by the parameter are applied the new instance 
      in a manner similar to at(name,value).  The receiving object is unchanged.
      
      A "defensive setter" semantics is used so object can be subsequently mutated 
      by the caller without affecting this.       
       
      Example:       
          var uri = $.uri('http://api.jquery.com:8080/main/index.html?format=json');
          uri = uri.at({ port: '2020', path: 'welcome.html' });
          assert uri.at('port') == '2020'
          assert uri.at('path') == 'welcome.html'
       
      If object.query is defined, then the query part of the result is the same
      as if .at("query", object.query) were called.

      Example:       
         var uri = $.uri('http://api.jquery.com?a=1&b=2');
         uri = uri.at({ query: { b:200, c:300 }});
         assert uri.at('query').a == 1;
         assert uri.at('query').b == 200;
         assert uri.at('query').c == 300;

   - toString([compareFunction])
      Return a well-formed URL representing this object.
      Unspecified components (e.g., if .at('port') == '') do not appear at the result.
      Names and value of parameters at the query part are encoded via encodeURIComponent().
      
      Caller can pass an optional compareFunction to affect the order of parameters 
      at the query part of the result. If compareFunction is not specified, order is 
      undefined.
      
      parameter: compareFunction 
         A function taking two arguments, a and b, each of which is an object  
         with two properties - name, value - representing a query parameter. 

         Returns 
            -1 if a should appear before b, 
            +1 if a should appear after b, 
            0 otherwise.
            
   - retain(name1, name2, ...) 
      Keep the specified query parmas, discard all others.
      Return a new instance similar to this one except that its query 
      part contains only the params whose names are specified by name1, name2, 
      etc. All other params are discarded from the result. The receiving object 
      is unchanged.
            
      Example:       
          var uri = $.uri('http://api.jquery.com?a=1&b=2&c=3&d=4');
          assert uri.retain('b', 'c').at('query') == { b:2, c: 3 }
          
   - defaults(anObject) 
      Provide defaults for query parameters.
      Properties of anObject provide new name,value mappings for the query part
      of the returned object. A mapping will be ignored if an existing parameter 
      (with the same name) is already defined. 
      The receiving object is unchanged.

      Example:       
         var uri = $.uri('http://api.jquery.com?a=1&b=2');
         uri = uri.at({ query: { b:200, c:300 }});
         assert uri.at('query').a == 1;
         assert uri.at('query').b == 2;
         assert uri.at('query').c == 300;
                
*/


(function ($) {
   
   function parse(line) {
      
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

      function Raw() { };
      
      Raw.prototype.toString = function(compareFunction) {     
         var arr = [];
         $.each(this.params, function(k, v) {
            var x = { name: k, value: v };
            arr.push(x);
         });
         
         if(compareFunction)
            arr.sort(compareFunction);
         
         var q = "";
         $.each(arr, function(index, kv) {
            q += q.length > 0 ? "&" : "";
            q += encodeURIComponent(kv.name) + "=" + encodeURIComponent(kv.value);
         });
         
         return surround("", this.protocol, "://") + surround("", this.domain) 
            + surround(":", this.port) + surround("/", this.path) + surround("?", q);
      };
      
      Raw.prototype.clone = function() {     
         var result = $.extend(new Raw(), this);
         result.params = $.extend({}, this.params);
         return result;
      };
                       
      return $.extend(new Raw(), {
         protocol : protocolDomainPortPath.protocol,
         domain : domainPort.domain,      
         port : domainPort.port,         
         path : domainPortPath.path,         
         params: extractParams(queryFragment.query), 
         fragment : queryFragment.fragment         
      });
   }
   
   function isQuery(s) {
      return s == "query";
   }
   
   function set(obj, part, value) {
      checkLegalPart(part);
      var temp = obj.clone();
      if(isQuery(part)) 
         $.extend(temp.params, value);
      else
         temp[part] = value;
         
      return build(temp);
   }
   
   function setOptions(obj, options) {
      var res = obj.clone();     
      $.each(options, function(key, value) {
         if(isQuery(key))
            $.extend(res.params, value);
         else         
            res[key] = value;
         return true;
      });
      
      return build(res);     
   }

   
   function checkLegalPart(part) {
      var parts = ["protocol", "domain", "port", "path", "query", "fragment"];
      if($.inArray(part, parts) == -1) 
         throw "Unknown URI part '" + part + "'";
   }
   
   function get(obj, part) {
      checkLegalPart(part);               
      if(isQuery(part))
         return $.extend({}, obj.params);
      
      return obj[part] 
   }
   
   function build(xUri) {
      return {
         at: function(part, value) {
      
            if(arguments.length == 2) 
               return set(xUri, part, value);
            
            if($.isPlainObject(part)) 
               return setOptions(xUri, part);
            
            return get(xUri, part);
         },
      
         retain: function() {
            var temp = xUri.clone();
            temp.params = {};
            for(var i = 0; i < arguments.length; ++i) {
               var k = arguments[i];
               temp.params[k] = xUri.params[k];
            }
            
            return build(temp);
         },
      
         defaults: function(options) {
            var temp = xUri.clone();
            temp.params = $.extend({}, options, temp.params);
            return build(temp);
         },
         
         _raw: function() {
            return xUri;
         },
         
         toString: function(compareFunction) {
           return xUri.toString(compareFunction);
         }
      }
   }
   
   $.uri = function(x) {
      return build(parse(x));      
   } 
})(jQuery);


