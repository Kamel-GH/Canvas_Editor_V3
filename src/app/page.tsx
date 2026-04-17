import { CaseComponentNoSSR } from './CaseComponentNoSSR';

export default function Home() {
  return (
    <main className="editor-shell-page">
      <section className="editor-shell-stage">
        <div className="editor-shell-canvas">
          <CaseComponentNoSSR />
        </div>
      </section>
    </main>
  );
}
