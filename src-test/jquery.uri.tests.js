JqueryUriTests = TestCase("jquery.uri.tests");

JqueryUriTests.prototype.testDomainDoesNotIncludeProtocol = function() {
   assertEquals("only.the.domain", $.uri("protocol://only.the.domain").domain);
};

JqueryUriTests.prototype.testSingleParam = function() {
   assertEquals("b", $.uri("www.yahoo.com?a=b").params["a"]);
   assertEquals("bc", $.uri("www.yahoo.com?a=bc").params["a"]);
};

JqueryUriTests.prototype.testTwoParams = function() {
   var v = $.uri("www.yahoo.com?a=bc&d=ef").params;
   assertEquals("bc", v["a"]);
   assertEquals("ef", v["d"]);
};

JqueryUriTests.prototype.testParamValuesAreDecoded = function() {
   assertEquals(" &?", $.uri("some.domain?a=%20%26%3f").params["a"]);
};

JqueryUriTests.prototype.testParamNamesAreDecoded = function() {
   assertEquals("aValue", $.uri("some.domain?%20%26%3f=aValue").params[" &?"]);
};

JqueryUriTests.prototype.testSecondOverridesFirst = function() {
   var v = $.uri("www.yahoo.com?a=bc&a=ef").params;
   assertEquals("ef", v["a"]);
};

JqueryUriTests.prototype.testDomain = function() {
   var loc = $.uri("www.yahoo.com?a=bc&a=ef");
   assertEquals("www.yahoo.com", loc.domain);
};


JqueryUriTests.prototype.testDomainDoesNotIncludePath = function() {
   var loc = $.uri("only.the.domain/path");
   assertEquals("only.the.domain", loc.domain);
};

JqueryUriTests.prototype.testProtocol = function() {
   assertEquals("http", $.uri("http://does.not.matter").protocol);
   assertEquals("", $.uri("does.not.matter").protocol);
};

JqueryUriTests.prototype.testPort = function() {
   assertEquals("9090", $.uri("does.not.matter:9090").port);
   assertEquals("", $.uri("does.not.matter").port);
};

JqueryUriTests.prototype.testPath = function() {
   assertEquals("", $.uri("does.not.matter").path);
   assertEquals("a", $.uri("does.not.matter/a").path);
   assertEquals("this/is/the/path", $.uri("does.not.matter/this/is/the/path").path);
}

JqueryUriTests.prototype.testPathDoesNotIncludeTrailingSlashes = function() {
   assertEquals("no/trailing/slash", $.uri("does.not.matter/no/trailing/slash/").path);
   assertEquals("no/trailing/slashes", $.uri("does.not.matter/no/trailing/slashes///").path);
};

JqueryUriTests.prototype.testPathWithNoDomain = function() {
   assertEquals("just/the/path", $.uri("/just/the/path").path);
   assertEquals("just/the/path", $.uri(":2020/just/the/path").path);
};

JqueryUriTests.prototype.testAnchor = function() {
   assertEquals("fragment", $.uri("domain?ignore=me#fragment").fragment);
   assertEquals("fragment", $.uri("domain?#fragment").fragment);
   assertEquals("fragment", $.uri("domain#fragment").fragment);
};

JqueryUriTests.prototype.testToString = function() {
   assertEquals("/just/the/path", $.uri("/just/the/path").toString());
   assertEquals("protocol://host/path", $.uri("protocol://host/path").toString());
   assertEquals("protocol://fully.qualified.hostname/a/four/part/path", 
      $.uri("protocol://fully.qualified.hostname/a/four/part/path").toString());
   assertEquals("protocol://host:port/path", $.uri("protocol://host:port/path").toString());
   assertEquals("protocol://host?p1=abc", $.uri("protocol://host?p1=abc").toString());
};


JqueryUriTests.prototype.testToStringEncodesParameterValues = function() {
   var loc = $.uri("");
   loc.params = { "55": " &?" };
      
   assertEquals("?55=%20%26%3F", loc.toString().toUpperCase());
};


JqueryUriTests.prototype.testToStringEncodesParameterNames = function() {
   var loc = $.uri("");
   loc.params = { " &?": "VALUE" };
      
   assertEquals("?%20%26%3F=VALUE", loc.toString().toUpperCase());
};

JqueryUriTests.prototype.testToStringWithCustomOrderBasedOnKeys = function() {
   var loc = $.uri("?2=b&3=c&1=a");
   assertEquals("?1=a&2=b&3=c", loc.toString(function(lhs, rhs) {
      return lhs.key - rhs.key;      
   }));
};

JqueryUriTests.prototype.testToStringWithCustomOrderBasedOnValues = function() {
   var loc = $.uri("?2=b&3=c&1=a");
   assertEquals("?1=a&2=b&3=c", loc.toString(function(lhs, rhs) {
      return lhs.value.charCodeAt(0) - rhs.value.charCodeAt(0);    
   }));
};

JqueryUriTests.prototype.testClone = function() {
   var src = $.uri("protcol://domain?1=a&2=b");
   var copy = src.clone();
   
   copy.params[2] = 'BB';
   copy.params[3] = 'c';
   copy.port = 100;
      
   assertEquals("protcol://domain?1=a&2=b", 
      src.toString(function(lhs, rhs) { return lhs.key - rhs.key }));
      
   assertEquals("protcol://domain:100?1=a&2=BB&3=c", 
      copy.toString(function(lhs, rhs) { return lhs.key - rhs.key }));
};

