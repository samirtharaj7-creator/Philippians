import { readFileSync, writeFileSync } from "node:fs";

const path = "content/background.json";
const content = JSON.parse(readFileSync(path, "utf8"));
const sourceSections = new Map(content.sections.map((section) => [section.title, section]));

const groups = [
  {
    id: "author-date-and-place",
    title: "Author, Date, and Place",
    sources: [
      "A Letter of Joy Written from Prison",
      "Authorship",
      "Paul’s Place of Imprisonment",
      "Paul’s Situation in Prison"
    ]
  },
  {
    id: "philippi-and-its-world",
    title: "Philippi and Its World",
    sources: [
      "The City of Philippi",
      "The Religious and Social Environment",
      "Paul’s Roman Citizenship"
    ]
  },
  {
    id: "founding-of-the-church",
    title: "The Founding of the Philippian Church",
    sources: [
      "The Founding of the Philippian Church",
      "Lydia and the Beginning of the Church",
      "The Enslaved Girl and the Conflict with the City",
      "The Philippian Jailer"
    ]
  },
  {
    id: "church-and-missionary-partnership",
    title: "The Church and Its Missionary Partnership",
    sources: [
      "The Character of the Philippian Church",
      "Paul’s Later Contacts with Philippi",
      "Epaphroditus and the Philippians’ Gift",
      "Timothy’s Proposed Visit"
    ]
  },
  {
    id: "circumstances-and-challenges",
    title: "Circumstances and Challenges",
    sources: ["The Problems Facing the Church"]
  },
  {
    id: "purpose-literary-character-and-structure",
    title: "Purpose, Literary Character, and Structure",
    sources: [
      "The Purpose of Philippians",
      "Literary Character of the Letter",
      "General Structure"
    ]
  },
  {
    id: "major-theological-themes",
    title: "Major Theological Themes",
    sources: [
      "Partnership in the Gospel",
      "Joy in Christ",
      "The Person and Work of Christ",
      "The Mind of Christ",
      "Justification by Faith",
      "Salvation and Obedience",
      "Suffering with Christ",
      "Spiritual Growth and Perfection",
      "Heavenly Citizenship and the Second Coming",
      "The Day of Christ",
      "Prayer, Peace, and the Christian Mind",
      "Christian Contentment",
      "Unity in the Church"
    ]
  },
  {
    id: "enduring-message",
    title: "The Enduring Message of Philippians",
    sources: ["The Enduring Significance of Philippians"]
  }
];

const used = new Set();
content.sections = groups.map((group) => ({
  id: group.id,
  title: group.title,
  blocks: group.sources.flatMap((sourceTitle) => {
    const source = sourceSections.get(sourceTitle);
    if (!source) throw new Error(`Missing source section: ${sourceTitle}`);
    used.add(sourceTitle);
    return [{ type: "heading", title: sourceTitle }, ...source.blocks];
  })
}));

const unused = [...sourceSections.keys()].filter((title) => !used.has(title));
if (unused.length) throw new Error(`Unassigned source sections: ${unused.join(", ")}`);

content.title = "Introduction to the Book of Philippians";
content.subtitle = "Historical setting, authorship, purpose, literary design, and major theological themes.";
writeFileSync(path, `${JSON.stringify(content, null, 2)}\n`);
console.log(`Reformatted ${used.size} topics into ${content.sections.length} introduction sections.`);
