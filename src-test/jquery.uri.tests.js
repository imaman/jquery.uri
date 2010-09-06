JqueryUriTests = TestCase("jquery.uri.tests");

JqueryUriTests.prototype.testProtocolGet = function() {
   assertEquals("protocol", 
      $.uri("protocol://domain").at("protocol"));
};

JqueryUriTests.prototype.testProtocolSet = function() {
   assertEquals("new.protocol", 
      $.uri("old.protocol://domain").at("protocol", "new.protocol").at("protocol"));      
};

JqueryUriTests.prototype.testDomainGet = function() {
   assertEquals("only.the.domain", 
      $.uri("protocol://only.the.domain").at("domain"));
};

JqueryUriTests.prototype.testDomainSet = function() {
   assertEquals("new.domain", 
      $.uri("protocol://old.domain").at("domain", "new.domain").at("domain"));
};

JqueryUriTests.prototype.testAtHasNoSideEffects = function() {
   var orig = $.uri("protocol://old.domain");
   orig.at("domain", "new.domain");
   assertEquals("old.domain", orig.at("domain"));
};

JqueryUriTests.prototype.testPortGet = function() {
   assertEquals("2020", $.uri("protocol://domain:2020").at("port"));
};

JqueryUriTests.prototype.testPortSet = function() {
   assertEquals("4321", 
      $.uri("protocol://domain:2020").at("port", "4321").at("port"));
};

JqueryUriTests.prototype.testPathGet = function() {
   assertEquals("this/is/the/path", 
      $.uri("protocol://domain/this/is/the/path").at("path"));
};

JqueryUriTests.prototype.testPathSet = function() {
   assertEquals("new/path", 
      $.uri("protocol://domain/old/path").at("path", "new/path").at("path"));
};

JqueryUriTests.prototype.testQueryGet = function() {
   assertEquals("one", 
      $.uri("?first=one&second=two").at("query").first);
};

JqueryUriTests.prototype.testQueryIsDefensiveGetter = function() {

	var uri = $.uri("?first=one&second=two");
	uri.at("query").first = "100";
   	assertEquals("one", uri.at("query").first);
};

JqueryUriTests.prototype.testFragmentGet = function() {
   assertEquals("there", $.uri("protocol://domain#there").at("fragment"));
};

JqueryUriTests.prototype.testFragmentSet = function() {
   assertEquals("new.fragment", 
      $.uri("protocol://domain/old/path").at("fragment", "new.fragment").at("fragment"));
};

JqueryUriTests.prototype.testAtCanSetMultiplePartsViaOptions = function() {
   var orig = $.uri("protocol://domain#old.fragment");
   var mutated = orig.at({ fragment: "new.fragment", port: "9009" });
   assertEquals("new.fragment", mutated.at("fragment"));
   assertEquals("9009", mutated.at("port"));
};

JqueryUriTests.prototype.testAtWithOptionsHasNoSideEffects = function() {
   var orig = $.uri("protocol://domain#old.fragment");
   orig.at({ fragment: "new.fragment", port: "9009" });
   assertEquals("old.fragment", orig.at("fragment"));
   assertEquals("", orig.at("port"));
};

JqueryUriTests.prototype.testRejectsUnknownPartsAtGet = function() {
   var shouldComplainAbout = function(part) {
      try {
         $.uri("").at(part);
      }
      catch(e) {
         return;
      }
      fail(part + " was accepted");   
   }
   
   shouldComplainAbout("protocol_");
   shouldComplainAbout("domain_");
   shouldComplainAbout("port_");
   shouldComplainAbout("_path");
   shouldComplainAbout("_fragment");   
};

JqueryUriTests.prototype.testRejectsUnknownPartsAtGet = function() {
   var shouldComplainAbout = function(part) {
      try {
         $.uri("").at(part, "");
      }
      catch(e) {
         return;
      }
      fail(part + " was accepted");   
   }
   
   shouldComplainAbout("protocol_");
   shouldComplainAbout("domain_");
   shouldComplainAbout("port_");
   shouldComplainAbout("_path");
   shouldComplainAbout("_fragment");   
};


