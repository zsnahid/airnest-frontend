export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-white text-base-content p-4">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by airNest
        </p>
      </aside>
    </footer>
  );
}
