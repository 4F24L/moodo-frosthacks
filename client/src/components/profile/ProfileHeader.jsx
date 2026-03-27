import { Mail, Settings } from "lucide-react";

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-card rounded-3xl p-8 shadow-sm border border-border flex flex-col md:flex-row items-center gap-8">
      <div className="relative">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-32 h-32 rounded-3xl object-cover shadow-xl ring-4 ring-card"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
          <Settings className="w-5 h-5" />
        </div>
      </div>
      <div className="text-center md:text-left space-y-2 flex-1">
        <h1 className="text-3xl font-bold font-display text-foreground">
          {user.name}
        </h1>
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Mail className="w-4 h-4" />
            {user.email}
          </div>
        </div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pt-2">
          Member since {user.joined}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
