JqueryUrRawiTests = TestCase("jquery.uri.raw.tests");


JqueryUrRawiTests.prototype.testDomainDoesNotIncludeProtocol = function() {
   assertEquals("only.the.domain", $.uri("protocol://only.the.domain")._raw().domain);
};


JqueryUrRawiTests.prototype.testSingleParam = function() {
   assertEquals("b", $.uri("www.yahoo.com?a=b")._raw().params["a"]);
   assertEquals("bc", $.uri("www.yahoo.com?a=bc")._raw().params["a"]);
};

JqueryUrRawiTests.prototype.testTwoParams = function() {
   var v = $.uri("www.yahoo.com?a=bc&d=ef")._raw().params;
   assertEquals("bc", v["a"]);
   assertEquals("ef", v["d"]);
};

JqueryUrRawiTests.prototype.testParamValuesAreDecoded = function() {
   assertEquals(" &?", $.uri("some.domain?a=%20%26%3f")._raw().params["a"]);
};

JqueryUrRawiTests.prototype.testParamNamesAreDecoded = function() {
   assertEquals("aValue", $.uri("some.domain?%20%26%3f=aValue")._raw().params[" &?"]);
};

JqueryUrRawiTests.prototype.testSecondOverridesFirst = function() {
   var v = $.uri("www.yahoo.com?a=bc&a=ef")._raw().params;
   assertEquals("ef", v["a"]);
};

JqueryUrRawiTests.prototype.testDomain = function() {
   var loc = $.uri("www.yahoo.com?a=bc&a=ef")._raw();
   assertEquals("www.yahoo.com", loc.domain);
};



JqueryUrRawiTests.prototype.testDomainDoesNotIncludePath = function() {
   var loc = $.uri("only.the.domain/path")._raw();
   assertEquals("only.the.domain", loc.domain);
};

JqueryUrRawiTests.prototype.testProtocol = function() {
   assertEquals("http", $.uri("http://does.not.matter")._raw().protocol);
   assertEquals("", $.uri("does.not.matter")._raw().protocol);
};

JqueryUrRawiTests.prototype.testPort = function() {
   assertEquals("9090", $.uri("does.not.matter:9090")._raw().port);
   assertEquals("", $.uri("does.not.matter")._raw().port);
};

JqueryUrRawiTests.prototype.testPath = function() {
   assertEquals("", $.uri("does.not.matter")._raw().path);
   assertEquals("a", $.uri("does.not.matter/a")._raw().path);
   assertEquals("this/is/the/path", $.uri("does.not.matter/this/is/the/path")._raw().path);
}

JqueryUrRawiTests.prototype.testPathDoesNotIncludeTrailingSlashes = function() {
   assertEquals("no/trailing/slash", $.uri("does.not.matter/no/trailing/slash/")._raw().path);
   assertEquals("no/trailing/slashes", $.uri("does.not.matter/no/trailing/slashes///")._raw().path);
};

JqueryUrRawiTests.prototype.testPathWithNoDomain = function() {
   assertEquals("just/the/path", $.uri("/just/the/path")._raw().path);
   assertEquals("just/the/path", $.uri(":2020/just/the/path")._raw().path);
};

JqueryUrRawiTests.prototype.testAnchor = function() {
   assertEquals("fragment", $.uri("domain?ignore=me#fragment")._raw().fragment);
   assertEquals("fragment", $.uri("domain?#fragment")._raw().fragment);
   assertEquals("fragment", $.uri("domain#fragment")._raw().fragment);
};

JqueryUrRawiTests.prototype.testToString = function() {
   assertEquals("/just/the/path", $.uri("/just/the/path")._raw().toString());
   assertEquals("protocol://host/path", $.uri("protocol://host/path")._raw().toString());
   assertEquals("protocol://fully.qualified.hostname/a/four/part/path", 
      $.uri("protocol://fully.qualified.hostname/a/four/part/path")._raw().toString());
   assertEquals("protocol://host:port/path", $.uri("protocol://host:port/path")._raw().toString());
   assertEquals("protocol://host?p1=abc", $.uri("protocol://host?p1=abc")._raw().toString());
};


JqueryUrRawiTests.prototype.testToStringEncodesParameterValues = function() {
   var loc = $.uri("")._raw();
   loc.params = { "55": " &?" };
      
   assertEquals("?55=%20%26%3F", loc.toString().toUpperCase());
};


JqueryUrRawiTests.prototype.testToStringEncodesParameterNames = function() {
   var loc = $.uri("")._raw();
   loc.params = { " &?": "VALUE" };
      
   assertEquals("?%20%26%3F=VALUE", loc.toString().toUpperCase());
};

JqueryUrRawiTests.prototype.testToStringWithCustomOrderBasedOnKeys = function() {
   var loc = $.uri("?2=b&3=c&1=a")._raw();
   assertEquals("?1=a&2=b&3=c", loc.toString(function(lhs, rhs) {
      return lhs.name - rhs.name;      
   }));
};


JqueryUrRawiTests.prototype.testToStringWithCustomOrderBasedOnValues = function() {
   var loc = $.uri("?2=b&3=c&1=a")._raw();
   assertEquals("?1=a&2=b&3=c", loc.toString(function(lhs, rhs) {
      return lhs.value.charCodeAt(0) - rhs.value.charCodeAt(0);    
   }));
};

JqueryUrRawiTests.prototype.testClone = function() {
   var src = $.uri("protocol://domain?1=a&2=b")._raw();
   var copy = src.clone();   
   copy.params[2] = 'BB';
   copy.params[3] = 'c';
   copy.port = 100;

   assertEquals("protocol://domain?1=a&2=b", 
      src.toString(function(lhs, rhs) {
         return parseInt(lhs.name) - parseInt(rhs.name); 
      }));

   
   assertEquals("protocol://domain:100?1=a&2=BB&3=c", 
      copy.toString(function(lhs, rhs) { 
         return parseInt(lhs.name) - parseInt(rhs.name) 
      }));
};

