import { Button } from "@/components/ui/button";
import { Contacts } from "@/services/contactsService";

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
  </svg>
);

const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const VKIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.45 14.88h-1.39c-.59 0-.77-.47-1.82-1.52-1.02-1-1.48-1.13-1.74-1.13-.35 0-.45.1-.45.59v1.39c0 .37-.12.59-1.11.59-1.63 0-3.45-.99-4.73-2.83-1.94-2.7-2.48-4.73-2.48-5.14 0-.26.1-.5.59-.5h1.39c.44 0 .61.2.78.67.85 2.42 2.26 4.54 2.84 4.54.22 0 .32-.1.32-.66v-2.56c-.07-1.13-.66-1.22-.66-1.62 0-.21.17-.42.44-.42h2.18c.37 0 .5.2.5.63v3.45c0 .37.17.5.27.5.22 0 .39-.13.78-.52 1.2-1.34 2.05-3.42 2.05-3.42.12-.24.31-.47.75-.47h1.39c.42 0 .51.21.42.63-.17.99-1.83 3.45-1.83 3.45-.19.3-.25.44 0 .78.18.25.78.77 1.18 1.24.73.82 1.28 1.51 1.43 1.99.15.47-.08.71-.55.71z"/>
  </svg>
);

interface SocialNetworksProps {
  contacts: Contacts | null;
  variant?: "full" | "icon-only";
  showTitle?: boolean;
}

const SocialNetworks = ({ contacts, variant = "full", showTitle = true }: SocialNetworksProps) => {
  if (!contacts) return null;

  const isFullVariant = variant === "full";

  return (
    <div className={isFullVariant ? "space-y-2 sm:space-y-3" : ""}>
      {showTitle && (
        <h3 className={`font-semibold ${isFullVariant ? "text-base sm:text-lg" : "mb-4"}`}>
          {isFullVariant ? "Связаться через мессенджеры" : "Мессенджеры:"}
        </h3>
      )}
      <div className={`flex ${isFullVariant ? "gap-2 sm:gap-4" : "space-x-4"}`}>
        {contacts.whatsappNumber && (
          <Button
            variant="outline"
            size={isFullVariant ? undefined : "sm"}
            className={
              isFullVariant
                ? "flex-1 h-10 sm:h-12 text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
                : "w-10 h-10 p-0 bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
            }
            onClick={() => {
              window.open(`https://wa.me/${contacts.whatsappNumber}`, '_blank');
            }}
          >
            <WhatsAppIcon />
            {isFullVariant && <span className="ml-2 hidden sm:inline">WhatsApp</span>}
          </Button>
        )}
        {contacts.telegram && (
          <Button
            variant="outline"
            size={isFullVariant ? undefined : "sm"}
            className={
              isFullVariant
                ? "flex-1 h-10 sm:h-12 text-sm sm:text-base bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
                : "w-10 h-10 p-0 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
            }
            onClick={() => {
              window.open(`https://t.me/${contacts.telegram}`, '_blank');
            }}
          >
            <TelegramIcon />
            {isFullVariant && <span className="ml-2 hidden sm:inline">Telegram</span>}
          </Button>
        )}
        {contacts.vk && (
          <Button
            variant="outline"
            size={isFullVariant ? undefined : "sm"}
            className={
              isFullVariant
                ? "flex-1 h-10 sm:h-12 text-sm sm:text-base bg-[#0077FF] hover:bg-[#0066DD] text-white border-[#0077FF] hover:border-[#0066DD]"
                : "w-10 h-10 p-0 bg-[#0077FF] hover:bg-[#0066DD] text-white border-[#0077FF] hover:border-[#0066DD]"
            }
            onClick={() => {
              window.open(`https://vk.com/${contacts.vk}`, '_blank');
            }}
          >
            <VKIcon />
            {isFullVariant && <span className="ml-2 hidden sm:inline">VK</span>}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SocialNetworks;
