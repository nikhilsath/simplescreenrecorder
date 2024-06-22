const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const text = article.textContent;
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);

  // Create the badge element for reading time
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `⏱️ ${readingTime} min read`;

  // Create the timer element
  const timer = document.createElement("span");
  timer.classList.add("color-secondary-text", "type--caption", "timer");
  timer.textContent = " - 0:00 elapsed";

  // Append the timer to the badge
  badge.appendChild(timer);

  // Support for API reference docs
  const heading = article.querySelector("h1");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  (date ?? heading).insertAdjacentElement("afterend", badge);

  // Timer logic
  let seconds = 0;
  setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timer.textContent = ` - ${minutes}:${remainingSeconds.toString().padStart(2, '0')} elapsed`;
  }, 1000);
}
