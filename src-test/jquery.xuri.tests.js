Jquery_UriTests = TestCase("jquery.xuri.tests");


Jquery_UriTests.prototype.testDomainDoesNotIncludeProtocol = function() {
   assertEquals("only.the.domain", $._uri("protocol://only.the.domain").domain);
};


Jquery_UriTests.prototype.testSingleParam = function() {
   assertEquals("b", $._uri("www.yahoo.com?a=b").params["a"]);
   assertEquals("bc", $._uri("www.yahoo.com?a=bc").params["a"]);
};

Jquery_UriTests.prototype.testTwoParams = function() {
   var v = $._uri("www.yahoo.com?a=bc&d=ef").params;
   assertEquals("bc", v["a"]);
   assertEquals("ef", v["d"]);
};

Jquery_UriTests.prototype.testParamValuesAreDecoded = function() {
   assertEquals(" &?", $._uri("some.domain?a=%20%26%3f").params["a"]);
};

Jquery_UriTests.prototype.testParamNamesAreDecoded = function() {
   assertEquals("aValue", $._uri("some.domain?%20%26%3f=aValue").params[" &?"]);
};

Jquery_UriTests.prototype.testSecondOverridesFirst = function() {
   var v = $._uri("www.yahoo.com?a=bc&a=ef").params;
   assertEquals("ef", v["a"]);
};

Jquery_UriTests.prototype.testDomain = function() {
   var loc = $._uri("www.yahoo.com?a=bc&a=ef");
   assertEquals("www.yahoo.com", loc.domain);
};


Jquery_UriTests.prototype.testDomainDoesNotIncludePath = function() {
   var loc = $._uri("only.the.domain/path");
   assertEquals("only.the.domain", loc.domain);
};

Jquery_UriTests.prototype.testProtocol = function() {
   assertEquals("http", $._uri("http://does.not.matter").protocol);
   assertEquals("", $._uri("does.not.matter").protocol);
};

Jquery_UriTests.prototype.testPort = function() {
   assertEquals("9090", $._uri("does.not.matter:9090").port);
   assertEquals("", $._uri("does.not.matter").port);
};

Jquery_UriTests.prototype.testPath = function() {
   assertEquals("", $._uri("does.not.matter").path);
   assertEquals("a", $._uri("does.not.matter/a").path);
   assertEquals("this/is/the/path", $._uri("does.not.matter/this/is/the/path").path);
}

Jquery_UriTests.prototype.testPathDoesNotIncludeTrailingSlashes = function() {
   assertEquals("no/trailing/slash", $._uri("does.not.matter/no/trailing/slash/").path);
   assertEquals("no/trailing/slashes", $._uri("does.not.matter/no/trailing/slashes///").path);
};

Jquery_UriTests.prototype.testPathWithNoDomain = function() {
   assertEquals("just/the/path", $._uri("/just/the/path").path);
   assertEquals("just/the/path", $._uri(":2020/just/the/path").path);
};

Jquery_UriTests.prototype.testAnchor = function() {
   assertEquals("fragment", $._uri("domain?ignore=me#fragment").fragment);
   assertEquals("fragment", $._uri("domain?#fragment").fragment);
   assertEquals("fragment", $._uri("domain#fragment").fragment);
};

Jquery_UriTests.prototype.testToString = function() {
   assertEquals("/just/the/path", $._uri("/just/the/path").toString());
   assertEquals("protocol://host/path", $._uri("protocol://host/path").toString());
   assertEquals("protocol://fully.qualified.hostname/a/four/part/path", 
      $._uri("protocol://fully.qualified.hostname/a/four/part/path").toString());
   assertEquals("protocol://host:port/path", $._uri("protocol://host:port/path").toString());
   assertEquals("protocol://host?p1=abc", $._uri("protocol://host?p1=abc").toString());
};


Jquery_UriTests.prototype.testToStringEncodesParameterValues = function() {
   var loc = $._uri("");
   loc.params = { "55": " &?" };
      
   assertEquals("?55=%20%26%3F", loc.toString().toUpperCase());
};


Jquery_UriTests.prototype.testToStringEncodesParameterNames = function() {
   var loc = $._uri("");
   loc.params = { " &?": "VALUE" };
      
   assertEquals("?%20%26%3F=VALUE", loc.toString().toUpperCase());
};

Jquery_UriTests.prototype.testToStringWithCustomOrderBasedOnKeys = function() {
   var loc = $._uri("?2=b&3=c&1=a");
   assertEquals("?1=a&2=b&3=c", loc.toString(function(lhs, rhs) {
      return lhs.key - rhs.key;      
   }));
};

Jquery_UriTests.prototype.testToStringWithCustomOrderBasedOnValues = function() {
   var loc = $._uri("?2=b&3=c&1=a");
   assertEquals("?1=a&2=b&3=c", loc.toString(function(lhs, rhs) {
      return lhs.value.charCodeAt(0) - rhs.value.charCodeAt(0);    
   }));
};

Jquery_UriTests.prototype.testClone = function() {
   var src = $._uri("protocol://domain?1=a&2=b");
   var copy = src.clone();
   
   copy.params[2] = 'BB';
   copy.params[3] = 'c';
   copy.port = 100;
      
   assertEquals("protocol://domain?1=a&2=b", 
      src.toString(function(lhs, rhs) { return lhs.key - rhs.key }));
      
   assertEquals("protocol://domain:100?1=a&2=BB&3=c", 
      copy.toString(function(lhs, rhs) { return lhs.key - rhs.key }));
};


