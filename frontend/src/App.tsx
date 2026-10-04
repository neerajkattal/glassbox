import { TopBar } from "./components/layout/TopBar";
import { DONE_KEY } from "./hooks/useMission";
import { useHashRoute } from "./hooks/useHashRoute";
import { useI18n } from "./i18n";
import { readStored } from "./lib/storage";
import { DigitIsland } from "./pages/DigitIsland";
import { HomePage } from "./pages/HomePage";

export default function App() {
  const { t } = useI18n();
  const [route, navigate] = useHashRoute();
  const goHome = () => navigate("home");

  return (
    <>
      <TopBar
        title={route === "digit-island" ? t.mission.title : undefined}
        onHome={goHome}
        showDepth={route === "digit-island"}
      />
      {route === "digit-island" ? (
        <DigitIsland onHome={goHome} />
      ) : (
        <HomePage
          started={(readStored("digit:step") ?? "meet") !== "meet"}
          digitDone={readStored(DONE_KEY) === "1"}
          onStart={() => navigate("digit-island")}
        />
      )}
    </>
  );
}
