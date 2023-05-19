<template>
    <div class="slider_wrapper">
        <div class="slider">
            <input class="slider-target" type="radio" :id="`slide-${index}`" name="slider"
                v-for="(item, index) in placeholderImage" :checked="index == (Math.ceil(placeholderImage.length / 2) - 1)"
                :key="index" />
            <div class="slider__viewport">
                <div class="slider__viewbox">
                    <div class="slider__container">
                        <div class="slider-item" v-for="(item, index) in placeholderImage" :key="index">
                            <div class="slider-item__inner">
                                <label class="slider-item__trigger" :for="`slide-${index}`"
                                    :title="`Show product ${index}`"></label>
                                <a class="card" :style="`--card-image:url('${item.coverUrl}')`">
                                    <div class="card__container">
                                        <div class="card__image"></div>
                                        <div class="card__content">
                                            <p class="card-meta">
                                                <span class="card-meta-item">{{ item.year }}</span>
                                                <span class="card-meta-item">{{ item.duration }}</span>
                                            </p>
                                            <h2 class="card-title">{{ item.title }}</h2>
                                            <ul class="card-tag-list">
                                                <li class="card-tag-list-item" v-for="tag in item.tags" :key="tag">{{ tag }}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'boxDetails',
    data() {
        return {
            placeholderImage: [
                {
                    title: 'Joker',
                    year: 2019,
                    duration: '2h 2m',
                    tags: ['Crime', 'Drama', 'Thriller'],
                    coverUrl: 'https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UY720_.jpg ',
                    description: "A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic villain.",
                    link: 'https://www.imdb.com/title/tt7286456',
                }, {
                    title: 'Dragon Ball Super: Super Hero',
                    year: 2022,
                    duration: '1h 40m',
                    tags: ['Animation', 'Action', 'Adventure'],
                    coverUrl: 'https://m.media-amazon.com/images/M/MV5BYmQ1Y2Y4NmItY2E4Mi00ZmM2LWFiOTEtMGVmMDRhN2ZiODU0XkEyXkFqcGdeQXVyNTkxMzEwMzU@._V1_FMjpg_UY720_.jpg',
                    description: "The Red Ribbon Army from Goku's past has returned with two new androids to challenge him and his friends.",
                    link: 'https://www.imdb.com/title/tt14614892'
                }, {
                    title: 'Interstellar',
                    duration: '2h 49m',
                    year: 2014,
                    tags: ['Action', 'Drama', 'Sci-Fi'],
                    coverUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UY720_.jpg',
                    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                    link: "https://www.imdb.com/title/tt0816692"
                }, {
                    title: 'Spider-Man: No Way Home',
                    year: 2021,
                    duration: '2h 28m',
                    tags: ['Action', 'Adventure', 'Fantasy'],
                    coverUrl: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_FMjpg_UY720_.jpg',
                    description: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
                    link: "https://www.imdb.com/title/tt10872600"
                }, {
                    title: 'The Batman',
                    year: 2022,
                    duration: '2h 56m',
                    tags: ['Action', 'Crime', 'Drama'],
                    coverUrl: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_FMjpg_UY720_.jpg',
                    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
                    link: "https://www.imdb.com/title/tt1877830/"
                }, {
                    title: 'Top Gun: Maverick',
                    duration: '2h 10m',
                    year: 2022,
                    tags: ['Action', 'Drama'],
                    coverUrl: 'https://m.media-amazon.com/images/M/MV5BOWQwOTA1ZDQtNzk3Yi00ZmVmLWFiZGYtNjdjNThiYjJhNzRjXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX988_.jpg',
                    description: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
                    link: "https://www.imdb.com/title/tt1745960/"
                }, {
                    title: 'Fight Club',
                    duration: '2h 19m',
                    tags: ['Drama'],
                    coverUrl: 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_FMjpg_UY720_.jpg',
                    year: 1999,
                    description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
                    link: 'https://www.imdb.com/title/tt0137523/'
                }
            ]
        };
    },
    methods: {
        handleActive(event) {
            console.log(event);
        }
    }
};
</script>
<style lang="scss" scoped>
$component: "slider";
$slider-items: 7;
$slider-visible-item: 3;
$slider-viewport-width: 100%;
$slider-viewbox-ratio: 2/3;
$slider-item-active: 3;
$slider-viewbox-width: $slider-viewport-width / $slider-visible-item;
$slider-viewbox-height: (
    1 / $slider-viewbox-ratio) * 100%;
$slider-viewbox-max-width: calc(50vh
);
$transition-scale: 1;
$transition-duration: 0.6s;
$transition-timing-function: cubic-bezier(0.62, 0.28, 0.23, 0.99);
@import "./components/slider.scss";
</style>