import styles from "./legacy.module.css";

export default function LegacyEditorPage() {
  return (
    <main className={styles.legacyPage}>
      <section className={styles.legacyStage}>
        <div className={styles.legacyCanvas}>
          <div className={styles.legacyWrapper}>
            <div className={styles.legacySurface}>
              <div className="flex h-full items-center justify-center p-8 text-center text-sm text-slate-500">
                Legacy editor archived outside the frozen stack.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
