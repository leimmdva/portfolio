import type { SkillGroup } from "~/content/site";
import { TagList } from "~/components/ui/Tag";
import { SectionHead } from "./SectionHead";
import { useUi } from "~/i18n/ui";
import styles from "./Skills.module.css";

export function Skills({ groups }: { groups: SkillGroup[] }) {
  const ui = useUi();
  return (
    <section id="skills" aria-labelledby="skills-title">
      <SectionHead id="skills-title" title={ui.skillsTitle} />
      {groups.map((g) => (
        <div key={g.name} className={styles.group}>
          <h3 className={styles.name}>{g.name}</h3>
          <TagList items={g.items} />
        </div>
      ))}
    </section>
  );
}
