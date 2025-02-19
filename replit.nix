{ pkgs }: {
  deps = [
    #pkgs.nodejs-18_x  # ou une version compatible de Node.js
    pkgs.glib          # ajoute la bibliothèque glib
  ];
}
