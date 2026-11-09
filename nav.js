/*! Pulseneon navigation – sole controller */
(function(){
"use strict";
function ready(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }
ready(function(){
  var nav=document.getElementById("site-nav"); if(!nav) return;
  var drawer=document.getElementById("nav-drawer");
  var backdrop=document.getElementById("nav-backdrop");
  var burger=document.getElementById("nav-burger");
  var closeBtn=document.getElementById("nav-close");
  if(!drawer||!burger) return;

  function openDrawer(){
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden","false");
    burger.setAttribute("aria-expanded","true");
    if(backdrop){ backdrop.hidden=false; }
    document.documentElement.classList.add("nav-open");
  }
  function closeDrawer(){
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden","true");
    burger.setAttribute("aria-expanded","false");
    if(backdrop){ backdrop.hidden=true; }
    document.documentElement.classList.remove("nav-open");
  }

  burger.onclick=function(e){
    e.preventDefault(); e.stopPropagation();
    if(burger.getAttribute("aria-expanded")==="true") closeDrawer(); else openDrawer();
  };
  if(closeBtn) closeBtn.onclick=function(e){ e.preventDefault(); closeDrawer(); };
  if(backdrop) backdrop.onclick=function(){ closeDrawer(); };
  document.addEventListener("keydown", function(e){ if(e.key==="Escape") closeDrawer(); });

  function closeAllPanels(){
    nav.querySelectorAll(".nav-acc-btn").forEach(function(b){
      b.setAttribute("aria-expanded","false");
    });
    nav.querySelectorAll(".nav-acc-panel").forEach(function(p){
      p.hidden=true;
      p.classList.remove("is-open");
    });
  }

  nav.querySelectorAll(".nav-acc-btn").forEach(function(btn){
    btn.onclick=function(e){
      e.preventDefault(); e.stopPropagation();
      var key=btn.getAttribute("data-acc");
      var panel=nav.querySelector('.nav-acc-panel[data-panel="'+key+'"]');
      if(!panel) return;
      var wasOpen=btn.getAttribute("aria-expanded")==="true";
      closeAllPanels();
      if(!wasOpen){
        btn.setAttribute("aria-expanded","true");
        panel.hidden=false;
        panel.classList.add("is-open");
      }
    };
  });

  var path=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  if(!path) path="index.html";
  nav.querySelectorAll("a.nav-link").forEach(function(a){
    var href=(a.getAttribute("href")||"").split("#")[0].toLowerCase();
    if(href===path){
      a.setAttribute("aria-current","page");
      var panel=a.closest(".nav-acc-panel");
      if(panel){
        var key=panel.getAttribute("data-panel");
        var btn=nav.querySelector('.nav-acc-btn[data-acc="'+key+'"]');
        if(btn){
          btn.setAttribute("aria-expanded","true");
          panel.hidden=false;
          panel.classList.add("is-open");
        }
      }
    }
  });

  nav.querySelectorAll("a.nav-link, .nav-drawer-foot a").forEach(function(a){
    a.addEventListener("click", function(){ setTimeout(closeDrawer, 20); });
  });
});
})();
