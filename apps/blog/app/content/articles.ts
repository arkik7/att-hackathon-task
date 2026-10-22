export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "small-tools-clear-boundaries",
    title: "Small tools, clear boundaries",
    category: "Editorial",
    publishedAt: "2026-09-18",
    excerpt:
      "A shared component can make products feel familiar without making their teams or services the same.",
    sections: [
      {
        heading: "Familiar does not mean coupled",
        paragraphs: [
          "A familiar link, a consistent heading, a button that behaves the way you expect: small details help people move confidently between products. At Northstar, the engineering journal shares frontend components with other applications. That gives our publishing work a recognizable shape. It does not mean that publishing an article needs an equipment order, a customer account, or a People Directory request. The distinction matters because a useful shared tool should make its consumers easier to understand.",
          "Our journal is maintained in the Remix application. Articles are reviewed as files and shipped with the site. The workflow is deliberately modest. Editorial can read a proposed change, discuss its language, and see the result without coordinating a release across the business services. Sharing a component is a practical choice about presentation, rather than an invitation to share every responsibility.",
        ],
      },
      {
        heading: "Make the boundary easy to see",
        paragraphs: [
          "Clear boundaries start with ordinary questions. What information does this screen need? Who owns that information? What happens when a neighboring service is unavailable? For the journal, the answers are reassuringly short. The articles live with the application, the publishing team reviews them, and readers should still be able to open a story when the commerce stack is stopped. These answers describe a product more usefully than a diagram full of similarly named boxes.",
          "Names are helpful clues, but they are not proof of a relationship. Editorial may discuss an inventory of articles or user research. Those phrases belong to publishing work. They should not silently turn into dependencies on Inventory or Accounts. Reading the surrounding code and documentation is still necessary, even when a search result looks promising.",
        ],
      },
      {
        heading: "Keep small tools small",
        paragraphs: [
          "There is a temptation to turn every repeated pattern into a platform. Sometimes that is useful. Often a shared link and a few visual conventions are enough. A good abstraction has a clear purpose, a small surface, and an understandable cost when it changes. It should remove a repeated decision without hiding the decisions that belong to each product.",
          "Our aim is a journal that feels related to the wider Northstar family while remaining straightforward to publish. That means coherent typography, readable navigation, and local content. The next improvement does not have to be an infrastructure project. It can be a better article introduction, a clearer category, or a link that helps someone find the next thing to read. Small tools earn their place by making the work around them simpler. That is a worthwhile goal.",
        ],
      },
    ],
  },
  {
    slug: "the-quiet-release",
    title: "The quiet release",
    category: "Design",
    publishedAt: "2026-09-16",
    excerpt:
      "Good interface improvements often announce themselves through a calmer, clearer workday.",
    sections: [
      {
        heading: "Notice what gets easier",
        paragraphs: [
          "Some releases arrive with a new capability and a long explanation. Others improve the moments between tasks: finding a link, reading a label, understanding whether an action succeeded. Those changes can look small in a release note, yet they shape almost every visit to a product. A quiet release succeeds when the interface asks for less interpretation and leaves more attention for the work itself.",
          "Typography is a good example. A larger heading is not automatically a clearer heading. Its relationship to the surrounding text matters: the space above it, the length of the line beneath it, and the distinction between a section title and a status message. A useful hierarchy lets someone scan a page before committing to reading it. It makes a screen approachable without removing the detail that an experienced person needs.",
        ],
      },
      {
        heading: "Give every state a voice",
        paragraphs: [
          "A polished screen needs more than a successful response. Loading, an empty collection, a failed request, and a search with no matches describe different situations. When all four become a blank panel, the person using the application has to diagnose the system. Clear words can spare them that effort. “No articles match this category” suggests changing a filter. “The service is unavailable” suggests trying again. Neither needs a dramatic illustration.",
          "The same care applies after an action. A stock adjustment should say what changed. An order lookup should identify the record it found. A declined demonstration payment should describe that outcome rather than borrowing the appearance of a successful purchase. Visual consistency helps, but the words must carry their own meaning. Color alone cannot explain a result to every reader.",
        ],
      },
      {
        heading: "Release the useful increment",
        paragraphs: [
          "It is easy to delay a modest improvement until it belongs to a grand redesign. A navigation label waits for a new information architecture; a readable profile waits for a complete design system. There is value in choosing a coherent, bounded increment instead. The journal can gain better article navigation while keeping file-based publishing. A directory can show clear fields while keeping the same service contract.",
          "Before calling such work finished, walk through it at a narrow screen width, with a keyboard, and with a request that fails. Check that the page still explains itself. Those visits reveal whether the release improved the experience or merely changed its appearance. The quiet release is not defined by how little code it contains. It is defined by the ordinary friction it removes, and by how comfortably the next person can continue the work.",
        ],
      },
    ],
  },
  {
    slug: "money-in-minor-units",
    title: "Why we keep money in minor units",
    category: "Engineering",
    publishedAt: "2026-09-12",
    excerpt:
      "A small representation choice makes prices easier to move through a system without losing their meaning.",
    sections: [
      {
        heading: "Start with the amount",
        paragraphs: [
          "A price looks simple on a product card. Behind that label, several parts of an application need to agree on what the number means. A catalog provides a price, an order calculates a total, a payment records an amount, and the interface formats a value for a person. If each boundary guesses at the unit, a perfectly plausible number can become a very confusing purchase.",
          "Northstar’s commerce interfaces use fields such as price_minor and total_minor. For the USD prices shown in the demo, 2500 minor units represents 25 dollars. The field name makes the unit visible where data crosses an interface. This is a small design choice with a useful effect: someone reading a response can distinguish the stored amount from the formatted string on the screen. The formatting belongs at the presentation boundary.",
        ],
      },
      {
        heading: "Keep arithmetic and presentation separate",
        paragraphs: [
          "Integer amounts make ordinary addition easier to reason about. An order can combine line amounts in minor units and produce another amount in minor units. The interface then turns that result into a readable currency label. It should not parse a label such as “$25.00” back into business data or scatter divisions across unrelated rendering branches. A small formatting function keeps that responsibility in one place.",
          "A number still needs context. Currency and unit are part of the meaning of an amount, even when a demonstration uses only one currency. Avoid assuming that every future currency follows the same decimal convention. For this application, the display can honestly say USD and use the existing minor-unit contract. Extending the business model to other currencies would require a deliberate contract decision, rather than a different symbol in a component.",
        ],
      },
      {
        heading: "Review the boundaries",
        paragraphs: [
          "The useful review questions are concrete. Does the product card show the same price that the catalog returned? Does the order total use the order response? Does a missing payment appear as missing, rather than as a zero-dollar charge? Can a declined order still show its actual recorded total without implying success? These questions connect representation to the experience someone sees.",
          "A technical convention is strongest when it reduces ambiguity for both engineers and users. Explicit field names help engineers move amounts safely through requests and responses. Consistent currency formatting helps readers compare products and understand results. Neither requires a broad financial framework for a small local demonstration. It requires a clear unit, a stable contract, and a few careful checks at the places where numbers become decisions. The humble amount field deserves that attention because it travels farther than its size suggests.",
        ],
      },
    ],
  },
  {
    slug: "local-data-clear-tradeoffs",
    title: "Local data, clear tradeoffs",
    category: "Engineering",
    publishedAt: "2026-09-09",
    excerpt:
      "Local persistence makes a demo approachable when its lifecycle and limits stay visible.",
    sections: [
      {
        heading: "Make the first run understandable",
        paragraphs: [
          "A local application is easier to explore when getting started does not require assembling an account, provisioning a database, and discovering a set of remote credentials. Northstar’s demonstration services use local data stores and synthetic records. That choice lets people investigate a working application and its source without first creating an external environment. It is an intentional constraint, not a claim that every production system should use the same arrangement.",
          "Convenience comes with responsibilities. A developer needs to know where data lives, when records are initialized, and whether stopping a process removes anything. A friendly setup guide answers those questions alongside the startup command. Otherwise, local persistence becomes mysterious persistence: a changed stock count survives one restart, a reset restores it, and the person using the demo cannot tell which behavior to expect.",
        ],
      },
      {
        heading: "Separate a restart from a reset",
        paragraphs: [
          "Restarting an application and resetting its data are different operations. A restart is often useful for picking up a code or configuration change. A reset intentionally returns the demonstration to an initial state. Treating them as interchangeable makes it difficult to reproduce a sequence, especially after creating orders or adjusting inventory. Good instructions name the operation and describe what it affects.",
          "The same distinction belongs in everyday investigation. When a screen displays an unexpected record, first ask whether it came from the current local store or the original fixture. Check the service that owns it rather than editing a neighboring file that happens to contain the same identifier. Synthetic data can still have a history within a running demo. Understanding that history is more useful than repeatedly starting everything over.",
        ],
      },
      {
        heading: "Choose a deliberate boundary",
        paragraphs: [
          "Local data works well for a bounded learning environment because its cost and purpose are easy to explain. It supports a short feedback loop: inspect a record, make a request, and observe the result. It also encourages concrete questions about ownership. Which service calculates an order total? Which store contains stock? Which endpoint returns a directory snapshot? The application becomes a set of inspectable decisions rather than a distant deployment.",
          "The tradeoff should stay visible in documentation and editorial language. A convenient local store does not establish claims about distributed reliability, production access control, or long-term data operations. Those are separate design questions. For this demonstration, the aim is a useful, repeatable experience with a clear lifecycle. A good local setup is modest about what it promises and precise about what it does. That precision helps both the first visitor and the engineer returning a week later.",
        ],
      },
    ],
  },
  {
    slug: "reading-an-order",
    title: "Reading an order without guessing",
    category: "Operations",
    publishedAt: "2026-09-05",
    excerpt:
      "Order and payment states become more useful when an interface explains the record it actually received.",
    sections: [
      {
        heading: "An identifier is a starting point",
        paragraphs: [
          "An order reference is a convenient way to begin a support conversation. It is short enough to copy, specific enough to search, and useful across several screens. It is not the whole story. A person looking up an order usually needs to understand its current state, its total, and the payment information associated with it. Returning a block of data may expose all those fields while still leaving the central question unanswered.",
          "A clear detail panel gives each fact a place. The order reference identifies the record. A status label describes the recorded outcome. A total includes its currency. A charge reference, when present, identifies the associated payment record. These are small presentation choices, but they turn a response into something that can support a conversation. They also make missing information easier to notice and explain.",
        ],
      },
      {
        heading: "Use the state you have",
        paragraphs: [
          "An interface should describe the state returned by the service rather than inventing a more satisfying journey. A confirmed order and a declined order are different outcomes. Neither automatically establishes that a parcel has shipped or reached a customer. Adding a decorative delivery timeline can imply facts that the existing contract never supplied. It may look complete while making the product less trustworthy.",
          "The demonstration payment options make this especially visible. An approved payment and a declined payment should produce distinguishable feedback. A decline is a recorded result that deserves an explanation, not an unexplained red box or a generic success message. When someone deliberately selects the declined option, the application should help them understand what happened and how to try a different demonstration outcome. The language can be direct without sounding alarming.",
        ],
      },
      {
        heading: "Handle absence deliberately",
        paragraphs: [
          "Missing information has several meanings. An unknown order reference is different from a temporary service failure. An absent charge is different from a zero amount. A customer detail request that fails should not quietly reuse the customer from the previous lookup. Good interfaces clear stale details when a new request begins and identify the result that is currently on screen.",
          "These behaviors are easier to assess through a short walkthrough than through appearance alone. Find a known order, try an unknown reference, and repeat the lookup when a service is unavailable. Check an approved order and a declined one. Read the labels without relying on color. The goal is to make the response understandable in each case, while keeping the underlying service contract intact. A support tool earns confidence by being accurate about ordinary records and honest about the information it cannot currently provide.",
        ],
      },
    ],
  },
  {
    slug: "runbooks-for-the-next-person",
    title: "Runbooks for the next person",
    category: "Operations",
    publishedAt: "2026-09-02",
    excerpt:
      "A useful runbook connects an observable symptom to a careful next step.",
    sections: [
      {
        heading: "Begin where the reader is",
        paragraphs: [
          "A runbook is often opened by someone who did not write the system and is already trying to resolve a problem. They may have a failed request, an unfamiliar status, or a report that something looks wrong. Starting with a long architectural history asks them to do translation before they can act. A better starting point is the symptom they can observe and the information needed to identify the affected operation.",
          "Concrete identifiers help. A request reference, an order ID, and a service name can narrow an investigation far more effectively than a paragraph about general reliability. The runbook should explain where each value comes from and what question it helps answer. That does not require collecting every possible field. It requires choosing the evidence that connects a visible problem to a useful check.",
        ],
      },
      {
        heading: "Make each step answer a question",
        paragraphs: [
          "A command is more useful when its purpose is stated. Checking a health endpoint answers whether a process is responding. Looking up a specific order answers what that service currently records. Reading a charge record addresses a different question again. Putting these checks in an understandable order helps the reader separate a connectivity issue from a business outcome without assuming that one proves the other.",
          "Expected observations matter as much as commands. Describe what a successful check establishes and what it leaves unresolved. If the output can contain synthetic personal details, quote only the fields needed for the investigation. A runbook should reduce uncertainty without encouraging indiscriminate copying. The best evidence is the smallest amount that supports the next decision and can be interpreted by the next person who reads it.",
        ],
      },
      {
        heading: "Name the stopping point",
        paragraphs: [
          "A good operational document also explains when to stop. Repeating an action is not always harmless, and a retry is not a universal remedy. Before suggesting one, establish what the service recorded and whether the action can create another record. When the runbook cannot determine a safe next step, it should identify the unresolved question and the team or owner who can answer it.",
          "Runbooks need review after the incident as well as during it. Notice which instructions required private knowledge, which terms were ambiguous, and which commands did not answer the intended question. Update the document with those lessons while keeping the immediate path readable. The result should be a reliable handoff, rather than a transcript of everything that happened. Writing for the next person means respecting their attention, giving them enough context to judge the evidence, and making the limits of each instruction visible.",
        ],
      },
    ],
  },
  {
    slug: "accessible-by-default",
    title: "Clear interfaces include more people",
    category: "Design",
    publishedAt: "2026-08-28",
    excerpt:
      "Readable text, meaningful states, and predictable controls are practical design fundamentals.",
    sections: [
      {
        heading: "Clarity is part of the design",
        paragraphs: [
          "Accessibility begins in everyday interface decisions. A label that explains an input, a heading that describes a section, and a button with a clear action help people understand a screen before they interact with it. These choices benefit someone using a keyboard or a screen reader, and they also benefit someone who is tired, distracted, or visiting the application for the first time. They deserve attention before a final styling pass.",
          "Visual identity can support that clarity. Northstar’s blue and white palette gives related applications a recognizable family resemblance. The darker blue can carry readable links and primary actions, while the brighter accent can emphasize boundaries and focus. The colors do not need to perform every job. Dark text, pale surfaces, spacing, and meaningful words provide the structure that makes the palette useful.",
        ],
      },
      {
        heading: "Let controls explain themselves",
        paragraphs: [
          "A search field needs a label that remains visible after someone starts typing. A stock adjustment needs an accessible name that identifies both the action and the product. A selected tab needs a state that assistive technology can understand. None of these improvements requires a complicated interface. They require treating the control as a complete interaction rather than as a shape with text inside it.",
          "Keyboard focus deserves the same care as hover styling. People need to see which control will respond next, and they need a logical path through the page. A visible focus ring is useful information. It should remain clear on both white cards and tinted backgrounds. Likewise, a status should remain understandable when its color is removed: “Out of stock” tells a reader something that a gray dot alone cannot.",
        ],
      },
      {
        heading: "Try the ordinary alternatives",
        paragraphs: [
          "Checking a screen at a narrow width reveals more than its mobile layout. It exposes long identifiers, rigid toolbars, and headings that depended on a generous amount of space. Increasing text size reveals a similar set of assumptions. These are useful design checks because they ask whether the content still has a coherent order when its original arrangement changes.",
          "A practical review can be short and repeatable. Walk through the main task with a keyboard. Read the status messages without using their colors as clues. Open the screen on a phone-sized viewport and look for obscured actions or horizontal overflow. Try an empty result and a failed request. Improving those paths makes the product more dependable for a wider range of people. Accessibility is not a separate decorative layer. It is the work of making an interface communicate its purpose and respond predictably across the ways people actually use it.",
        ],
      },
    ],
  },
  {
    slug: "notes-that-age-well",
    title: "Engineering notes that age well",
    category: "Teamwork",
    publishedAt: "2026-08-24",
    excerpt:
      "Useful documentation preserves the reasoning behind a decision without pretending the decision is timeless.",
    sections: [
      {
        heading: "Leave a useful trail",
        paragraphs: [
          "An engineering note can be short and still save someone hours. Its value often comes from explaining why a choice was made, what alternatives were considered, and what evidence was available at the time. A list of current settings may answer how a system is configured today. A decision note answers a different question: why this arrangement made sense when the team chose it, and which assumptions might deserve another look.",
          "Dates and ownership make that reasoning easier to use. A reader needs to distinguish a historical discussion from a current reference, and a proposal from a shipped behavior. Giving a document a clear purpose is more helpful than making every page sound authoritative. A meeting note can preserve uncertainty. A reference should describe a contract. A runbook should guide an action. Each serves a reader in a different situation.",
        ],
      },
      {
        heading: "Connect claims to evidence",
        paragraphs: [
          "Repositories accumulate repeated terms. A component name appears in several applications; a customer identifier appears in multiple records; an old design mentions a service that no longer participates in a request. Search is the beginning of understanding those connections. The next step is to read the context, check the date, and inspect the source that can establish the specific claim under investigation.",
          "A useful note makes that path shorter. Link to the relevant contract or decision, explain the relationship in plain language, and avoid treating a familiar name as proof. When evidence disagrees, preserve the distinction rather than flattening the story into a confident paragraph. A historical plan and a current implementation may both be informative without describing the same state of the system. Good documentation makes room for that difference.",
        ],
      },
      {
        heading: "Write for a future question",
        paragraphs: [
          "The next reader may not share the author’s immediate concern. They might be changing a field, investigating a failed request, or deciding whether an old tradeoff still applies. Headings, examples, and explicit assumptions help them find the part that matters without reproducing the original conversation. A concise explanation of the boundary can be more useful than a complete chronological account of the project.",
          "Maintenance does not mean rewriting every old document to sound current. Sometimes the right change is a dated clarification and a link to the new source of truth. Sometimes a reference needs a correction because the contract changed. Keeping those purposes separate preserves the history while improving the present-day path. Engineering notes age well when they remain honest about their context and generous toward the next reader. They do not need to predict every future question. They need to leave enough evidence and reasoning for someone else to ask a better one.",
        ],
      },
    ],
  },
];

export function formatDate(value: string) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
export function readingTime(article: Article) {
  return Math.ceil(
    article.sections
      .flatMap((section) => section.paragraphs)
      .join(" ")
      .split(/\s+/).length / 200,
  );
}
