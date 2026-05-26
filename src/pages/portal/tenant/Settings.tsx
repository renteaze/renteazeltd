import PortalShell from "@/components/portal/PortalShell";
import SettingsForm from "@/components/SettingsForm";

const Settings = () => (
  <PortalShell role="tenant">
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account, security, and notification preferences</p>
      </div>
      <SettingsForm />
    </div>
  </PortalShell>
);

export default Settings;
