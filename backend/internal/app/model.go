package app

import "time"

type ProjectDetails struct {
	Scope        []string `json:"scope,omitempty"`
	Challenge    string   `json:"challenge,omitempty"`
	Solution     string   `json:"solution,omitempty"`
	Deliverables []string `json:"deliverables,omitempty"`
}

type ProjectVideo struct {
	Type   string `json:"type"`
	Src    string `json:"src"`
	Poster string `json:"poster,omitempty"`
}

type Project struct {
	ID                int64          `json:"id,omitempty"`
	Slug              string         `json:"slug"`
	RouteSlug         string         `json:"routeSlug"`
	Title             string         `json:"title"`
	Client            string         `json:"client"`
	Year              string         `json:"year"`
	Category          string         `json:"category"`
	Industry          string         `json:"industry"`
	Disciplines       []string       `json:"disciplines"`
	ShortDescription  string         `json:"shortDescription"`
	Description       string         `json:"description"`
	Excerpt           string         `json:"excerpt,omitempty"`
	CoverImage        string         `json:"coverImage"`
	HeroImage         string         `json:"heroImage,omitempty"`
	GridCoverPosition string         `json:"gridCoverPosition,omitempty"`
	HoverImage        string         `json:"hoverImage,omitempty"`
	GalleryImages     []string       `json:"galleryImages,omitempty"`
	Video             *ProjectVideo  `json:"video,omitempty"`
	Featured          bool           `json:"featured"`
	Priority          int            `json:"priority"`
	Tags              []string       `json:"tags,omitempty"`
	Details           ProjectDetails `json:"details,omitempty"`
	Status            string         `json:"status"`
	PublishedAt       *time.Time     `json:"publishedAt,omitempty"`
	CreatedAt         time.Time      `json:"createdAt,omitempty"`
	UpdatedAt         time.Time      `json:"updatedAt,omitempty"`
}

type Config struct {
	Addr            string
	DatabasePath    string
	FrontendOrigin  string
	CookieSecure    bool
	AdminUsername   string
	AdminPassword   string
	AdminTOTPSecret string
	S3Endpoint      string
	S3AccessKey     string
	S3SecretKey     string
	S3Bucket        string
	S3UseSSL        bool
	LegacyMediaRoot string
}
