/**
 * Scrolls the RSVP snap container to a target element by ID.
 *
 * scrollIntoView() propagates to every scrollable ancestor including
 * the window. Because <main> has padding-top: var(--nav-h), the browser
 * tries to scroll the window so the element lands at y=0, which hides
 * the section header behind the fixed navbar. Driving the container's
 * scrollTop directly avoids this entirely.
 */
export function scrollRsvpTo(targetId) {
  const target = document.getElementById(targetId);
  const container = document.querySelector('.rsvp-scroll-container');
  if (!target || !container) return;
  const top =
    target.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop;
  container.scrollTo({ top, behavior: 'smooth' });
}
