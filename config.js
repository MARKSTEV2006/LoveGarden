
/* ==========================================
   LOVE GARDEN
   30TH MONTHSARY EDITION

   FULL UPDATED CONFIG.JS

   37 LOVE PICTURES
   11 BOOTAN PICTURES
   23 COUPLE PICTURE SLOTS
   5 VIDEOS WITH THUMBNAILS

   BACKGROUND MUSIC: MP3
   ========================================== */


// ==========================================
// GENERATE PHOTO FILENAMES
// ==========================================

function createPhotoList(prefix, total, exceptions = {}) {

  return Array.from(
    { length: total },
    (_, index) => {

      const number = index + 1;

      return (
        exceptions[number] ||
        `${prefix}${number}.jpg`
      );

    }
  );

}


// ==========================================
// LOVE GARDEN CONFIGURATION
// ==========================================

window.LOVE_CONFIG = {

  // ======================================
  // PERSONAL INFORMATION
  // ======================================

  recipient: "My Gwapahay na Lovelove",

  sender: "Forever Yours ♡",


  // ======================================
  // ENVELOPE OPENING MESSAGE
  // ======================================

  openingLine:
    "Beautiful na regalo para sang beautiful ko na gf. ♡",


  // ======================================
  // LOVE LETTER - 30TH MONTHSARY
  // ======================================

  letterTitle: "To My Bebe,",

  message: [

    // PARAGRAPH 1

    "Hi, my love! Happy happy happiest 30th Monthsary.",


    // PARAGRAPH 2

    `Hello Lovelove ko, first of all salamat san tanan, salamat sang pagdawat mo ng ka oahan asta batasan ko, bahala busy kaw ginahatag mo ako ng time, sorry love
kay medyo masobrahan ako dala ng kamingaw agaw sorryhay love, wamo kapansin bebe pero ga bag o ako para kanmo, na para mapakita ko yang pagka sincere ko na gusto takaw asta love takaw,
grateful ako sang tanan na mga ibuhat mo para lang di ako maka feel na ya left out, thank you bebe, tanan efforts mo yakita ko yaan, agaw way rason na kambyuhan or magbuwag kita love,`,


    // PARAGRAPH 3

    `Sigera love imaintain molang yang ipangayo kolang na manalinga kaw, mulikay kaw sang mga maraat, asta magtarong kaw lang ngawn ok da gayud ako saan, otaw lang ako bebe, gusto ko isab ng attention agaw medyo yalain yang action ko pero
dili pasabot saan na di takaw love, kundi gusto kolang ng time mo,na awn bebetime nato para di masira relasyon ta na which is amo ikahadlok ko, magatagad ako kanmo love, basta ayaw lang i pressure sarili mo,`,


    // PARAGRAPH 4

    `Ani lang ako permi musuporta asta maging proud kanmo, lovelove takaw always bebe wa yaan sang vocabulary nato na mag buwag, stay lang kanak love hantod sang makaya dako na alagaan takaw, stay lang kanak permi bebe, kung awn man
pagalalisan nato, sabay nato yaan i fix para kanato duha, Happiest 30th Monthsary lovelove, love you so much alwaysssss and forever kanak gwapaaaa. ♡`

  ],


  // ======================================
  // BACKGROUND MUSIC
  // ======================================

  // Music plays when the envelope opens.

  music: "assets/music.mp3",


  // ======================================
  // PHOTO AND VIDEO GALLERY
  // ======================================

  gallery: [

    // ====================================
    // ALBUM 1
    // BEBE KO NA GWAPAHAY
    // 37 SOLO PICTURES NIYA
    // ====================================

    {

      id: "bebe",

      title: "BEBE KO NA GWAPAHAY",

      subtitle: "My beautiful girl ♡",

      type: "photo",

      // love1.jpg to love36.jpg
      // love37.png

      items: createPhotoList(
        "love",
        37,
        {
          37: "love37.png"
        }
      )

    },


    // ====================================
    // ALBUM 2
    // BOOTAN
    // 11 SOLO PICTURES MO
    // ====================================

    {

      id: "bootan",

      title: "BOOTAN",

      subtitle: "Your favorite boy ♡",

      type: "photo",

      // bootan1.jpg to bootan11.jpg

      items: createPhotoList("bootan", 11)

    },


    // ====================================
    // ALBUM 3
    // OUR MEMORIES
    // 23 EXPECTED PICTURE SLOTS
    // ====================================

    {

      id: "together",

      title: "OUR MEMORIES",

      subtitle: "Our precious moments together ♡",

      type: "photo",

      // photos8 and photos9 are PNG.
      //
      // photos17.jpg and photos23.jpg
      // are not currently uploaded.
      //
      // They are excluded temporarily
      // to prevent broken images.
      //
      // Currently displays 21 photos.

      items: createPhotoList(
        "photos",
        23,
        {
          8: "photos8.png",
          9: "photos9.png"
        }
      ).filter(
        (filename) =>
          ![
            "photos17.jpg",
            "photos23.jpg"
          ].includes(filename)
      )

    },


    // ====================================
    // ALBUM 4
    // OUR VIDEOS
    // 5 VIDEOS WITH COVER THUMBNAILS
    // ====================================

    {

      id: "videos",

      title: "OUR VIDEOS",

      subtitle: "Our favorite moments together ♡",

      type: "video",

      items: [

        // VIDEO 1

        {

          file: "video1.mp4",

          caption: "Our First Video Together ♡",

          poster: "assets/thumbnails/cover1.jpg"

        },


        // VIDEO 2

        {

          file: "video2.mp4",

          caption: "My Favorite Moment With You ♡",

          poster: "assets/thumbnails/cover2.jpg"

        },


        // VIDEO 3

        {

          file: "video3.mp4",

          caption: "Forever Us ♡",

          poster: "assets/thumbnails/cover3.jpg"

        },


        // VIDEO 4

        {

          file: "video4.mp4",

          caption: "Our Beautiful Memories ♡",

          poster: "assets/thumbnails/cover4.jpg"

        },


        // VIDEO 5

        {

          file: "video5.mp4",

          caption: "Every Moment With You ♡",

          poster: "assets/thumbnails/cover5.jpg"

        }

      ]

    }

  ]

};


/* ==========================================
   END OF LOVE GARDEN CONFIG.JS
   ========================================== */
