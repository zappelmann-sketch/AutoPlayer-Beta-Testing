/* Handbook - runs in <head>, before anything is drawn: hides the top of the page (title, introduction,
   contents) until the pets build it (js/kapitelbau.js removes the class in its first frame). Without it
   the finished page would flash up for a moment on a slow page load. Not when the animation is off, the
   system asks for reduced motion, or the address jumps straight to a chapter.
   It also sets <html lang> from the address right away (same rule as the language switch: ?lang= first,
   else an #en-... anchor), so the header row shows "Home" instead of "Startseite" from the first frame. */
(function () {
  'use strict';
  var q = location.search;
  var wahl = /[?&]lang=(de|en)(?:&|$)/.exec(q);
  if (wahl ? wahl[1] === 'en' : location.hash.indexOf('#en-') === 0) document.documentElement.lang = 'en';
  if (/[?&]bau=aus(&|$)/.test(q) || location.hash.length > 1) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce && !/[?&]bau=an(&|$)/.test(q)) return;
  var root = document.documentElement;
  root.classList.add('kb-frueh');
  // safety net: never hide the top of the page for longer than this
  setTimeout(function () { root.classList.remove('kb-frueh'); }, 4000);
})();
