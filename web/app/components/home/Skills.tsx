import type { SkillGroup } from "~/content/site";
import { TagList } from "~/components/ui/Tag";
import { SectionHead } from "./SectionHead";
import styles from "./Skills.module.css";

export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <section id="skills" aria-labelledby="skills-title">
      <SectionHead id="skills-title" title="Skills" />
      {groups.map((g) => (
        <div key={g.name} className={styles.group}>
          <h3 className={styles.name}>{g.name}</h3>
          <TagList items={g.items} />
        </div>
      ))}
    </section>
  );
}
